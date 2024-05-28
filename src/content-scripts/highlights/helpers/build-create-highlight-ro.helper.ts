import findNodesByText from './to-receive-DOM-data/find-nodes-by-text.helper';
import getHighlightPerent from './to-receive-DOM-data/get-highlight-perent.helper';
import setInitialTextToHighlightPerent from './for-DOM-changes/set-initial-text-to-highlight-perent.helper';

import TCreateHighlightRo from '@/common/types/ro/highlights/create-highlight.type';

export default function buildCreateHighlightRo(
	range: Range,
	color: string,
	note?: string
): TCreateHighlightRo | null {
	if (!range.startContainer.textContent || !range.endContainer.textContent) return null;
	if (!range.startContainer.parentElement || !range.endContainer.parentElement) return null;

	setInitialTextToHighlightPerent(range.startContainer.parentElement);
	setInitialTextToHighlightPerent(range.endContainer.parentElement);

	const startContainerPerent = getHighlightPerent(range.startContainer);
	const endContainerPerent = getHighlightPerent(range.endContainer);
	if (!startContainerPerent || !endContainerPerent) return null;

	const startContainerPerentInitialText = startContainerPerent.getAttribute('data-initial-text');
	const endContainerPerentInitialText = endContainerPerent.getAttribute('data-initial-text');
	if (!startContainerPerentInitialText || !endContainerPerentInitialText) return null;

	const sameToStartContainerNodes = findNodesByText(range.startContainer.textContent);
	const sameToEndContainerNodes = findNodesByText(range.endContainer.textContent);

	const startNodeIndex = sameToStartContainerNodes.indexOf(range.startContainer);
	const endNodeIndex = sameToEndContainerNodes.indexOf(range.endContainer);

	return {
		pageUrl: location.href,
		startOffset: calculateOffset(range.startContainer, startContainerPerent, range.startOffset),
		endOffset: calculateOffset(range.endContainer, endContainerPerent, range.endOffset),
		startContainer: {
			text: startContainerPerentInitialText,
			indexNumber: startNodeIndex,
			sameElementsAmount: sameToStartContainerNodes.length,
		},
		endContainer: {
			text: endContainerPerentInitialText,
			indexNumber: endNodeIndex,
			sameElementsAmount: sameToEndContainerNodes.length,
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
