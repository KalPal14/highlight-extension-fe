import React, { useEffect } from 'react';

import createRangeFromHighlightDto from './helpers/create-range-from-highlight-dto.helper';
import CreateHighlight from './create-highlight';
import drawHighlight from './helpers/draw-highlight.helper';

import IApiResponseMsg from '@/common/types/extension-messages/api-response-msg.interface';
import TGetPageDto from '@/common/types/dto/pages/get-page.type';
import IBaseHighlightDto from '@/common/types/dto/highlights/base-highlight.interface';
import { PAGES_API_ROUTES } from '@/common/constants/api-routes/pages';
import TGetPageRo from '@/common/types/ro/pages/get-page.type';
import callSendApiRequestSw from '@/service-worker/helpers/call-send-api-request-sw.helper';

export default function Highlights(): JSX.Element {
	useEffect(() => {
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);
		callSendApiRequestSw<TGetPageRo>({
			contentScriptsHandler: 'getPageHandler',
			method: 'get',
			url: PAGES_API_ROUTES.getPage,
			data: {
				url: location.href,
			},
		});

		return () => {
			chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
		};
	}, []);

	function apiResponseMsgHandler({
		serviceWorkerHandler,
		contentScriptsHandler,
		data,
	}: IApiResponseMsg): void {
		if (serviceWorkerHandler !== 'apiRequest') return;
		switch (contentScriptsHandler) {
			case 'getPageHandler':
				getPageHandler(data as TGetPageDto);
				return;
		}
	}

	function getPageHandler(page: TGetPageDto): void {
		if (page.id === null) {
			return;
		}
		drawHighlightsFromDto(page.highlights);
	}

	function drawHighlightsFromDto(highlights: IBaseHighlightDto[] | null): void {
		if (!highlights) return;

		highlights.forEach((highlight) => {
			const highlightRange = createRangeFromHighlightDto(highlight);
			drawHighlight(highlightRange, highlight);
		});
	}

	return (
		<>
			<CreateHighlight />
		</>
	);
}
