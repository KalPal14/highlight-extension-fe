import React, { useEffect, useState } from 'react';

import buildCreateHighlightRo from './helpers/build-create-highlight-ro.helper';
import createRangeFromHighlightDto from './helpers/create-range-from-highlight-dto.helper';
import drawHighlight from './helpers/draw-highlight.helper';
import HighlightsController from './highlights-controller';

import IApiResponseMsg from '@/common/types/extension-messages/api-response-msg.interface';
import callSendApiRequestSw from '@/service-worker/helpers/call-send-api-request-sw.helper';
import { HIGHLIGHTS_API_ROUTES } from '@/common/constants/api-routes/highlights';
import TCreateHighlightRo from '@/common/types/ro/highlights/create-highlight.type';
import ICreateHighlightDto from '@/common/types/dto/highlights/create-highlight.interface';

export default function CreateHighlight(): JSX.Element {
	const [selectedRange, setSelectedRange] = useState<Range | null>(null);
	const [mouseСoordinates, setMouseСoordinates] = useState({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		document.addEventListener('mouseup', selectionHandler);
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);

		return () => {
			window.removeEventListener('mouseup', selectionHandler);
			chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
		};
	}, []);

	function selectionHandler({ target, clientX, clientY }: MouseEvent): void {
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
			y: clientY,
		});
	}

	function apiResponseMsgHandler({
		serviceWorkerHandler,
		contentScriptsHandler,
		data,
	}: IApiResponseMsg): void {
		if (serviceWorkerHandler !== 'apiRequest') return;
		switch (contentScriptsHandler) {
			case 'createHighlightHandler':
				createHighlightRespHandler(data as ICreateHighlightDto);
				return;
		}
	}

	async function createHighlight(color: string, note?: string): Promise<void> {
		if (!selectedRange) return;

		const newHighlightData = buildCreateHighlightRo(selectedRange, color, note);
		if (!newHighlightData) {
			return;
		}
		callSendApiRequestSw<TCreateHighlightRo>({
			contentScriptsHandler: 'createHighlightHandler',
			url: HIGHLIGHTS_API_ROUTES.create,
			method: 'post',
			data: newHighlightData,
		});
	}

	function createHighlightRespHandler(highlight: ICreateHighlightDto): void {
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
				clientY={mouseСoordinates.y}
				onSelectColor={createHighlight}
				onControllerClose={onControllerClose}
			/>
		);
	}

	return <></>;
}
