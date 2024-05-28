import React, { useEffect } from 'react';

import createRangeFromHighlightDto from './helpers/for-DOM-changes/create-range-from-highlight-dto.helper';
import CreateHighlight from './components/create-highlight';
import drawHighlight from './helpers/for-DOM-changes/draw-highlight.helper';
import InteractionWithHighlight from './components/interaction-with-highlight';

import TGetPageDto from '@/common/types/dto/pages/get-page.type';
import IBaseHighlightDto from '@/common/types/dto/highlights/base/base-highlight.interface';
import { PAGES_API_ROUTES } from '@/common/constants/api-routes/pages';
import TGetPageRo from '@/common/types/ro/pages/get-page.type';
import apiRequestDispatcher from '@/service-worker/handlers/api-request/api-request.dispatcher';
import IApiRequestOutcomeMsg from '@/service-worker/types/outcome-msgs/api-request.outcome-msg.interface';

export default function Highlights(): JSX.Element {
	useEffect(() => {
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);
		apiRequestDispatcher<TGetPageRo>({
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
	}: IApiRequestOutcomeMsg): void {
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
			<InteractionWithHighlight />
		</>
	);
}
