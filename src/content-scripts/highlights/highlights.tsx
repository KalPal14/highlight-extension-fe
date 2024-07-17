import React, { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { isEqual } from 'lodash';

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
import { HTTPError } from '@/errors/http-error/http-error';
import httpErrHandler from '@/errors/http-error/http-err-handler';
import getPageUrl from '@/common/helpers/get-page-url.helper';
import IUpdatedPagesUrlsExtState from '@/common/types/cross-ext-state/updated-pages-urls-ext-state.interface';
import setSidepanelDispatcher from '@/service-worker/handlers/set-sidepanel/open-sidepanel.dispatcher';

export default function Highlights(): JSX.Element {
	const componentBeforeGettingPageInfo = useRef(true);
	const updatedPagesUrlsRerendersCount = useRef(0);
	const prevHighlights = useRef<IBaseHighlightDto[] | null>(null);

	const [jwt] = useCrossExtState<null | string>('jwt', null);
	const [, setUnfoundHighlightsIds] = useCrossExtState<number[]>('unfoundHighlightsIds', []);
	const [updatedPages] = useCrossExtState<IUpdatedPagesUrlsExtState>('updatedPages', {
		urls: [],
	});
	const [isExtActive] = useCrossExtState<boolean>('isExtActive', false);

	useEffect(() => {
		if (!isExtActive) return;
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);
		apiRequestDispatcher<TGetPageRo>({
			contentScriptsHandler: 'getPageHandler',
			method: 'get',
			url: PAGES_API_ROUTES.getPage,
			data: {
				url: getPageUrl(),
			},
		});

		return () => {
			chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
		};
	}, [isExtActive]);

	useEffect(() => {
		if (componentBeforeGettingPageInfo.current) return;
		if (jwt && isExtActive) {
			apiRequestDispatcher<TGetPageRo>({
				contentScriptsHandler: 'getPageHandler',
				method: 'get',
				url: PAGES_API_ROUTES.getPage,
				data: {
					url: getPageUrl(),
				},
			});
		}

		if (!isExtActive) {
			setSidepanelDispatcher({ url: getPageUrl(), enabled: false });
		}
		if (!jwt || !isExtActive) {
			const highlights = document.getElementsByTagName('WEB-HIGHLIGHT');
			if (!highlights.length) {
				toast(
					<Toast
						title="Error getting page information"
						description="User is not authorized"
					/>
				);
				return;
			}
			window.location.reload();
		}
	}, [jwt, isExtActive]);

	useEffect(() => {
		if (updatedPagesUrlsRerendersCount.current <= 1) {
			updatedPagesUrlsRerendersCount.current++;
			return;
		}
		const pageUrl = getPageUrl();
		if (updatedPages.urls.includes(pageUrl)) {
			setSidepanelDispatcher({ url: getPageUrl(), enabled: false });
			window.location.reload();
		}
	}, [updatedPages]);

	function apiResponseMsgHandler({
		serviceWorkerHandler,
		contentScriptsHandler,
		data,
		isDataHttpError,
	}: IApiRequestOutcomeMsg): void {
		if (serviceWorkerHandler !== 'apiRequest') return;
		switch (contentScriptsHandler) {
			case 'getPageHandler':
				isDataHttpError
					? getPageErrHandler(data as HTTPError)
					: getPageHandler(data as TGetPageDto);
				componentBeforeGettingPageInfo.current = false;
				return;
		}
	}

	function getPageErrHandler(err: HTTPError): void {
		httpErrHandler({
			err,
			onErrWithMsg(msg) {
				toast(
					<Toast
						title="Error getting page information"
						description={msg}
					/>
				);
			},
			onUnhandledErr() {
				toast(
					<Toast
						title="Error getting page information"
						description="Please reload the page or try again later"
					/>
				);
			},
		});
	}

	function getPageHandler(page: TGetPageDto): void {
		if (page.id === null) return;
		drawHighlightsFromDto(page.highlights);
	}

	function drawHighlightsFromDto(highlights: IBaseHighlightDto[] | null): void {
		if (!highlights) return;
		if (isEqual(prevHighlights.current, highlights)) return;
		prevHighlights.current = highlights;

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

		renderInfoToasts(highlights.length, newUnfoundHighlightsIds.length);
		setUnfoundHighlightsIds((prevState) => [...prevState, ...newUnfoundHighlightsIds]);
	}

	function renderInfoToasts(allHighlights: number, unfoundHighlights: number): void {
		const foundHighlights = allHighlights - unfoundHighlights;
		{
			foundHighlights &&
				toast(
					<Toast
						status="success"
						title={`${foundHighlights} highlight${foundHighlights > 1 ? 's' : ''} successfully found in text`}
					/>
				);
		}
		if (unfoundHighlights) {
			toast(
				<Toast
					status="warning"
					title={`${unfoundHighlights} highlight${unfoundHighlights > 1 ? 's' : ''} not found in text`}
					description="You can see them by opening the sidepanel"
				/>
			);
		}
	}

	return (
		<main>
			{isExtActive && (
				<>
					<Toaster position="bottom-center" />
					<CreateHighlight />
					<InteractionWithHighlight />
				</>
			)}
		</main>
	);
}
