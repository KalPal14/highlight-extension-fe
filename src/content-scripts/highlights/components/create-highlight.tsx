import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import buildCreateHighlightRo from '../helpers/build-create-highlight-ro.helper';
import createRangeFromHighlightDto from '../helpers/for-DOM-changes/create-range-from-highlight-dto.helper';
import drawHighlight from '../helpers/for-DOM-changes/draw-highlight.helper';

import HighlightsController from './highlights-controller';

import { HIGHLIGHTS_API_ROUTES } from '@/common/constants/api-routes/highlights';
import TCreateHighlightRo from '@/common/types/ro/highlights/create-highlight.type';
import ICreateHighlightDto from '@/common/types/dto/highlights/create-highlight.interface';
import apiRequestDispatcher from '@/service-worker/handlers/api-request/api-request.dispatcher';
import IApiRequestOutcomeMsg from '@/service-worker/types/outcome-msgs/api-request.outcome-msg.interface';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import { HTTPError } from '@/errors/http-error/http-error';
import Toast from '@/content-scripts/common/ui/toasts/toast';
import httpErrHandler from '@/errors/http-error/http-err-handler';

export default function CreateHighlight(): JSX.Element {
	const [, setCreatedHighlight] = useCrossExtState<ICreateHighlightDto | null>(
		'createdHighlight',
		null
	);

	const [selectedRange, setSelectedRange] = useState<Range | null>(null);
	const [mouseСoordinates, setMouseСoordinates] = useState({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		document.addEventListener('mouseup', selectionHandler);
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);

		return () => {
			document.removeEventListener('mouseup', selectionHandler);
			chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
		};
	}, []);

	function selectionHandler({ target, clientX, pageY }: MouseEvent): void {
		if ((target as HTMLElement).id === 'highlights-ext-container') return;

		const newSelection = document.getSelection();
		if (!newSelection || newSelection.type !== 'Range') {
			setSelectedRange(null);
			return;
		}

		const newRange = newSelection.getRangeAt(0);
		setSelectedRange(newRange);
		setMouseСoordinates({
			x: clientX,
			y: pageY,
		});
	}

	function apiResponseMsgHandler({
		serviceWorkerHandler,
		contentScriptsHandler,
		data,
		isDataHttpError,
	}: IApiRequestOutcomeMsg): void {
		if (serviceWorkerHandler !== 'apiRequest') return;
		switch (contentScriptsHandler) {
			case 'createHighlightHandler':
				isDataHttpError
					? createHighlightErrHandler(data as HTTPError)
					: createHighlightRespHandler(data as ICreateHighlightDto);
				return;
		}
	}

	async function createHighlight(color: string, note?: string): Promise<void> {
		if (!selectedRange) return;

		const newHighlightData = buildCreateHighlightRo(selectedRange, color, note);
		if (!newHighlightData) {
			return;
		}
		apiRequestDispatcher<TCreateHighlightRo>({
			contentScriptsHandler: 'createHighlightHandler',
			url: HIGHLIGHTS_API_ROUTES.create,
			method: 'post',
			data: newHighlightData,
		});
	}

	function createHighlightErrHandler(err: HTTPError): void {
		httpErrHandler({
			err,
			onErrWithMsg(msg) {
				toast(
					<Toast
						title="Error creating highlight"
						description={msg}
					/>
				);
			},
			onUnhandledErr() {
				toast(
					<Toast
						title="Error creating highlight"
						description="Please reload the page or try again later"
					/>
				);
			},
		});
	}

	function createHighlightRespHandler(highlight: ICreateHighlightDto): void {
		setCreatedHighlight(highlight);
		const highlightRange = createRangeFromHighlightDto(highlight);
		drawHighlight(highlightRange, highlight);
		setSelectedRange(null);
	}

	async function onControllerClose(color: string, note?: string): Promise<void> {
		if (note) {
			await createHighlight(color, note);
		}
	}

	if (selectedRange) {
		return (
			<HighlightsController
				clientX={mouseСoordinates.x}
				pageY={mouseСoordinates.y}
				onSelectColor={createHighlight}
				onControllerClose={onControllerClose}
			/>
		);
	}

	return <></>;
}
