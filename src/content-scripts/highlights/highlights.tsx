import React, { useEffect, useState } from 'react';

import './highlights.scss';
import findTextToHighlight from './helpers/find-text-to-highlight.helper';
import INodeInRangeTextContent from './types/node-in-range-text-content.interface';

import { DEF_COLORS } from '@/common/constants/colors';

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

	function createHighlight(color: string): void {
		if (!range) return;

		const nodesInRangeList = findTextToHighlight(range.commonAncestorContainer, range);

		nodesInRangeList.forEach(({ node, textContent }, index) => {
			if (index === nodesInRangeList.length - 1 && !textContent.isAllInRange) {
				const lastNodeText = removeExtraLetterFromRange(textContent);
				wrapTextWithHighlighter(node, lastNodeText, color);
				return;
			}
			wrapTextWithHighlighter(node, textContent, color);
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
		{ strBeforeRange, strAfterRange, strInRange }: INodeInRangeTextContent,
		color: string
	): void {
		if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent || !textNode.parentElement) {
			return;
		}

		const wrapper = createHighlighterElement(strInRange, color);
		textNode.parentElement.replaceChild(wrapper, textNode);
		wrapper.before(strBeforeRange);
		wrapper.after(strAfterRange);
	}

	function createHighlighterElement(textToHighlight: string, color: string): HTMLSpanElement {
		const span = document.createElement('web-highlight');
		span.style.backgroundColor = color;
		span.addEventListener('click', () => {
			console.log('You clicked on the highlighter!');
			chrome.runtime.sendMessage({ type: 'apiRequest' });
		});
		span.innerText = textToHighlight;
		return span;
	}

	if (range) {
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
