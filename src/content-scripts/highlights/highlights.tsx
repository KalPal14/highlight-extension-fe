import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Toast from '../common/ui/toasts/toast';

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
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';

export default function Highlights(): JSX.Element {
	const [jwt] = useCrossExtState<null | string>('jwt', null);
	const [, setUnfoundHighlightsIds] = useCrossExtState<number[]>('unfoundHighlightsIds', []);

	useEffect(() => {
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);

		return () => {
			chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
		};
	}, []);

	useEffect(() => {
		if (jwt) {
			apiRequestDispatcher<TGetPageRo>({
				contentScriptsHandler: 'getPageHandler',
				method: 'get',
				url: PAGES_API_ROUTES.getPage,
				data: {
					url: location.href,
				},
			});
			return;
		}

		const highlights = document.getElementsByTagName('WEB-HIGHLIGHT');
		if (highlights.length) {
			window.location.reload();
		}
	}, [jwt]);

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
		if (page.id === null) return;
		drawHighlightsFromDto(page.highlights);
	}

	function drawHighlightsFromDto(highlights: IBaseHighlightDto[] | null): void {
		if (!highlights) return;

		const newUnfoundHighlightsIds: number[] = [];

		highlights.forEach((highlight) => {
			try {
				const highlightRange = createRangeFromHighlightDto(highlight);
				if (highlightRange.toString() !== highlight.text) {
					newUnfoundHighlightsIds.push(highlight.id);
					return;
				}
				drawHighlight(highlightRange, highlight);
			} catch {
				newUnfoundHighlightsIds.push(highlight.id);
			}
		});

		toast(
			<Toast
				status="success"
				title={`${highlights.length} highlight${highlights.length > 1 ? 's' : ''} successfully found in text`}
			/>
		);
		if (newUnfoundHighlightsIds.length) {
			toast(
				<Toast
					status="warning"
					title={`${newUnfoundHighlightsIds.length} highlight${newUnfoundHighlightsIds.length > 1 ? 's' : ''} not found in text`}
					description="You can see them by opening the sidepanel"
				/>
			);
		}
		setUnfoundHighlightsIds((prevState) => [...prevState, ...newUnfoundHighlightsIds]);
	}

	return (
		<main>
			<Toaster position="bottom-center" />
			<CreateHighlight />
			<InteractionWithHighlight />
		</main>
	);
}
