import findElementsByText from './to-receive-DOM-data/find-elements-by-text.helper';
import getHighlightPerent from './to-receive-DOM-data/get-highlight-perent.helper';
import setInitialTextToHighlightPerent from './for-DOM-changes/set-initial-text-to-highlight-perent.helper';

import TCreateHighlightRo from '@/common/types/ro/highlights/create-highlight.type';

export default function buildCreateHighlightRo(
	range: Range,
	color: string,
	note?: string
): TCreateHighlightRo | null {
	if (
		!range.startContainer.parentElement?.textContent ||
		!range.endContainer.parentElement?.textContent
	) {
		return null;
	}

	setInitialTextToHighlightPerent(range.startContainer.parentElement);
	setInitialTextToHighlightPerent(range.endContainer.parentElement);

	const startContainerPerent = getHighlightPerent(range.startContainer);
	const endContainerPerent = getHighlightPerent(range.endContainer);
	if (!startContainerPerent || !endContainerPerent) return null;

	const startContainerPerentInitialText = startContainerPerent.getAttribute('data-initial-text');
	const endContainerPerentInitialText = endContainerPerent.getAttribute('data-initial-text');
	if (!startContainerPerentInitialText || !endContainerPerentInitialText) return null;

	const sameToStartContainerPerent = findElementsByText(startContainerPerentInitialText);
	const sameToEndContainerPerent = findElementsByText(endContainerPerentInitialText);

	const startNodeIndex = sameToStartContainerPerent.indexOf(startContainerPerent);
	const endNodeIndex = sameToEndContainerPerent.indexOf(endContainerPerent);

	return {
		pageUrl: location.href,
		startOffset: calculateOffset(range.startContainer, startContainerPerent, range.startOffset),
		endOffset: calculateOffset(range.endContainer, endContainerPerent, range.endOffset),
		startContainer: {
			text: startContainerPerentInitialText,
			indexNumber: startNodeIndex,
			sameElementsAmount: sameToStartContainerPerent.length,
		},
		endContainer: {
			text: endContainerPerentInitialText,
			indexNumber: endNodeIndex,
			sameElementsAmount: sameToEndContainerPerent.length,
		},
		text: range.toString(),
		color,
		note,
	};
}

function calculateOffset(container: Node, perent: HTMLElement, offsetFromRange: number): number {
	let prevNodesTextLength = 0;

	callCalculate(container);

	function callCalculate(node: Node | HTMLElement): void {
		calculate(node);
		if (node.parentElement && node.parentElement !== perent) {
			callCalculate(node.parentElement);
		}
	}

	function calculate(node: Node | HTMLElement): void {
		if (!node.previousSibling) return;
		prevNodesTextLength = prevNodesTextLength + (node.previousSibling.textContent?.length ?? 0);
		calculate(node.previousSibling);
	}

	return offsetFromRange + prevNodesTextLength;
}
