import React, { useEffect, useState } from 'react';

import './highlights.scss';
import buildCreateHighlightRo from './helpers/build-create-highlight-ro.helper';
import createRangeFromHighlightDto from './helpers/create-range-from-highlight-dto.helper';
import drawHighlight from './helpers/draw-highlight.helper';

import { DEF_COLORS } from '@/common/constants/colors';
import IApiResponseMsg from '@/common/types/extension-messages/api-response-msg.interface';
import callSendApiRequestSw from '@/service-worker/helpers/call-send-api-request-sw.helper';
import { HIGHLIGHTS_API_ROUTES } from '@/common/constants/api-routes/highlights';
import TCreateHighlightRo from '@/common/types/ro/highlights/create-highlight.type';
import ICreateHighlightDto from '@/common/types/dto/highlights/create-highlight.interface';

export default function CreateHighlight(): JSX.Element {
	const [selectedRange, setSelectedRange] = useState<Range | null>(null);

	useEffect(() => {
		document.addEventListener('mouseup', selectionHandler);
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);

		return () => {
			window.removeEventListener('mouseup', selectionHandler);
			chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
		};
	}, []);

	function selectionHandler({ target }: MouseEvent): void {
		if ((target as HTMLElement).className.includes('highlighController')) return;

		const newSelection = document.getSelection();
		if (!newSelection || newSelection.type !== 'Range') {
			setSelectedRange(null);
			return;
		}

		const newRange = newSelection.getRangeAt(0);
		setSelectedRange(newRange);
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

	async function createHighlight(color: string): Promise<void> {
		if (!selectedRange) return;

		const newHighlightData = buildCreateHighlightRo(selectedRange, color);
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
	}

	if (selectedRange) {
		return (
			<div className="highlighController">
				{DEF_COLORS.map(({ color }, index) => (
					<div
						key={index}
						onClick={() => createHighlight(color)}
						className="highlighController_color"
						style={{
							backgroundColor: color,
						}}
					></div>
				))}
			</div>
		);
	}

	return <></>;
}
