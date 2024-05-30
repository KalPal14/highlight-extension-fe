import React, { useState, useEffect, useRef } from 'react';
import { union } from 'lodash';

import IHighlightElementData from '../types/highlight-element-data-interface';
import createHighlighterElement from '../helpers/for-DOM-changes/create-highlighter-element.helper';
import createRangeFromHighlightDto from '../helpers/for-DOM-changes/create-range-from-highlight-dto.helper';
import drawHighlight from '../helpers/for-DOM-changes/draw-highlight.helper';
import getNestedHighlightsIds from '../helpers/to-receive-DOM-data/get-nested-highlights-Ids.helper';

import HighlightsController from './highlights-controller';

import { HIGHLIGHTS_API_ROUTES } from '@/common/constants/api-routes/highlights';
import apiRequestDispatcher from '@/service-worker/handlers/api-request/api-request.dispatcher';
import IApiRequestOutcomeMsg from '@/service-worker/types/outcome-msgs/api-request.outcome-msg.interface';
import TUpdateHighlightRo from '@/common/types/ro/highlights/update-highlight.type';
import IUpdateHighlightDto from '@/common/types/dto/highlights/update-highlight.interface';
import IDeleteHighlightDto from '@/common/types/dto/highlights/delete-highlight.interface';
import TGetHighlightsRo from '@/common/types/ro/highlights/get-highlights.type';
import TGetHighlightsDto from '@/common/types/dto/highlights/get-highlights.type';

export default function InteractionWithHighlight(): JSX.Element {
	const highlightElementRef = useRef<IHighlightElementData | null>(null);
	const highlightElementToSetRef = useRef<IHighlightElementData | null>(null);

	const [currentHighlightElement, setCurrentHighlightElement] =
		useState<IHighlightElementData | null>(null);
	const [highlightElementSetDispatcher, setHighlightElementSetDispatcher] = useState(false);
	const [mouseСoordinates, setMouseСoordinates] = useState({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		document.addEventListener('click', onDocumentClickHandler);
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);

		return () => {
			document.removeEventListener('click', onDocumentClickHandler);
			chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
		};
	}, []);

	useEffect(() => {
		setCurrentHighlightElement(highlightElementToSetRef.current);
		highlightElementRef.current = highlightElementToSetRef.current;
	}, [highlightElementSetDispatcher]);

	function onDocumentClickHandler(event: MouseEvent): void {
		const target = event.target as Element | null;
		if (!target) return;

		if (target.tagName === 'HIGHLIGHTS-EXT-CONTAINER') return;

		setCurrentHighlightElement(null);

		if (target.tagName === 'WEB-HIGHLIGHT') {
			onHighlightClickHandler(event);
			return;
		}
	}

	function onHighlightClickHandler({ target, clientX, clientY }: MouseEvent): void {
		if (!target) return;

		if (document.getSelection()?.type === 'Range') return;

		const higlightElement = target as HTMLElement;

		highlightElementToSetRef.current = {
			elementId: higlightElement.id,
			highlightId: Number(higlightElement.id.split('web-highlight-')[1]),
			color: higlightElement.style.backgroundColor,
			note: higlightElement.getAttribute('data-higlight-note'),
		};
		setHighlightElementSetDispatcher((prevState) => !prevState);
		setMouseСoordinates({
			x: clientX,
			y: clientY,
		});
	}

	function apiResponseMsgHandler({
		serviceWorkerHandler,
		contentScriptsHandler,
		data,
		incomeData,
	}: IApiRequestOutcomeMsg): void {
		if (serviceWorkerHandler !== 'apiRequest') return;
		switch (contentScriptsHandler) {
			case 'updateHighlightRespHandler':
				updateHighlightRespHandler(data as IUpdateHighlightDto, incomeData as TUpdateHighlightRo);
				return;
			case 'deleteHighlightRespHandler':
				deleteHighlightRespHandler(data as IDeleteHighlightDto);
				return;
			case 'redrawErasedHighlights':
				redrawErasedHighlights(data as TGetHighlightsDto);
				return;
		}
	}

	function updateHighlightRespHandler(
		newHighlightData: IUpdateHighlightDto,
		incomeHighlightData: TUpdateHighlightRo
	): void {
		if (!incomeHighlightData.text) {
			updateHighlighterElement(newHighlightData);
		}
	}

	function updateHighlighterElement(highlight: IUpdateHighlightDto): void {
		const highlighterElements = document.querySelectorAll(`#web-highlight-${highlight.id}`);
		highlighterElements.forEach((highlighterElement) => {
			if (!highlighterElement.textContent) return;
			const newHighlighterElement = createHighlighterElement(
				highlighterElement.textContent,
				highlight
			);
			highlighterElement.replaceWith(newHighlighterElement);
		});
	}

	async function changeHighlightColor(color: string): Promise<void> {
		if (!currentHighlightElement) return;

		apiRequestDispatcher<TUpdateHighlightRo>({
			contentScriptsHandler: 'updateHighlightRespHandler',
			url: HIGHLIGHTS_API_ROUTES.update(currentHighlightElement.highlightId),
			method: 'patch',
			data: { color },
		});
	}

	async function onControllerClose(color: string, note?: string): Promise<void> {
		if (!highlightElementRef.current) return;
		if (!note && !highlightElementRef.current.note) return;

		if (note !== highlightElementRef.current.note) {
			apiRequestDispatcher<TUpdateHighlightRo>({
				contentScriptsHandler: 'updateHighlightRespHandler',
				url: HIGHLIGHTS_API_ROUTES.update(highlightElementRef.current.highlightId),
				method: 'patch',
				data: { note },
			});
		}
	}

	function onDeleteHighlight(): void {
		if (!currentHighlightElement) return;

		apiRequestDispatcher({
			contentScriptsHandler: 'deleteHighlightRespHandler',
			url: HIGHLIGHTS_API_ROUTES.delete(currentHighlightElement.highlightId),
			method: 'delete',
		});
	}

	function deleteHighlightRespHandler(highlight: IDeleteHighlightDto): void {
		const nestedHighlightsIds: number[][] = [];

		const highlighterElements = document.querySelectorAll(`#web-highlight-${highlight.id}`);
		highlighterElements.forEach((highlighterElement) => {
			if (!highlighterElement.textContent) return;
			highlighterElement.outerHTML = highlighterElement.getAttribute('data-initial-text')!;

			const nestedToThisHighlightIds = getNestedHighlightsIds(highlighterElement);
			nestedHighlightsIds.push(nestedToThisHighlightIds);
		});

		apiRequestDispatcher<TGetHighlightsRo>({
			contentScriptsHandler: 'redrawErasedHighlights',
			url: HIGHLIGHTS_API_ROUTES.getHighlghts,
			method: 'get',
			data: {
				ids: union(...nestedHighlightsIds),
			},
		});
		setCurrentHighlightElement(null);
	}

	function redrawErasedHighlights(highlights: TGetHighlightsDto): void {
		highlights.forEach((highlight) => {
			const highlightRange = createRangeFromHighlightDto(highlight);
			drawHighlight(highlightRange, highlight);
		});
	}

	if (currentHighlightElement) {
		return (
			<HighlightsController
				clientX={mouseСoordinates.x}
				clientY={mouseСoordinates.y}
				note={currentHighlightElement.note ?? undefined}
				forExistingHighlight={true}
				onSelectColor={changeHighlightColor}
				onControllerClose={onControllerClose}
				onDeleteClick={onDeleteHighlight}
			/>
		);
	}

	return <></>;
}
