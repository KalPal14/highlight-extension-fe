import React, { useEffect, useState } from 'react';

import './highlights.scss';
import findTextToHighlight from './helpers/find-text-to-highlight.helper';
import INodeInRangeTextContent from './types/node-in-range-text-content.interface';

export default function Highlights(): JSX.Element {
	const [range, setRange] = useState<Range | null>(null);

	useEffect(() => {
		document.addEventListener('mouseup', selectionHandler);

		return () => window.removeEventListener('mouseup', selectionHandler);
	}, []);

	function selectionHandler({ target }: MouseEvent): void {
		if ((target as HTMLElement).className.includes('highlighController')) return;

		const newSelection = document.getSelection();
		if (!newSelection || newSelection.type !== 'Range') {
			setRange(null);
			return;
		}

		const newRange = newSelection.getRangeAt(0);
		setRange(newRange);
	}

	function createHighlight(): void {
		if (!range) return;

		const nodesInRangeList = findTextToHighlight(range.commonAncestorContainer, range);

		nodesInRangeList.forEach(({ node, textContent }, index) => {
			// This must be done because the built-in range method 'comparePoint'
			// assigns an extra letter to the last element
			if (index === nodesInRangeList.length - 1) {
				const lastNodeText = removeExtraLetterFromRange(textContent);
				wrapTextWithHighlighter(node, lastNodeText);
				return;
			}
			wrapTextWithHighlighter(node, textContent);
		});
		setRange(null);
	}

	function removeExtraLetterFromRange({
		strBeforeRange,
		strInRange,
		strAfterRange,
	}: INodeInRangeTextContent): INodeInRangeTextContent {
		return {
			strBeforeRange,
			strInRange: strInRange.slice(0, strInRange.length - 1),
			strAfterRange: strInRange[strInRange.length - 1] + strAfterRange,
		};
	}

	function wrapTextWithHighlighter(
		textNode: Node,
		{ strBeforeRange, strAfterRange, strInRange }: INodeInRangeTextContent
	): void {
		if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent || !textNode.parentElement) {
			return;
		}

		const wrapper = createHighlighterElement(strInRange);
		textNode.parentElement.replaceChild(wrapper, textNode);
		wrapper.before(strBeforeRange);
		wrapper.after(strAfterRange);
	}

	function createHighlighterElement(textToHighlight: string): HTMLSpanElement {
		const span = document.createElement('web-highlight');
		span.style.backgroundColor = '#1488';
		span.addEventListener('click', () => {
			console.log('You clicked on the highlighter!');
		});
		span.innerText = textToHighlight;
		return span;
	}

	if (range) {
		return (
			<div
				onClick={createHighlight}
				className="highlighController"
			></div>
		);
	}

	return <></>;
}
