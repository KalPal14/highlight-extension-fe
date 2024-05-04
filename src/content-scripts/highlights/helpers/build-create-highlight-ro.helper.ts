import findNodesByText from './find-nodes-by-text.helper';

import TCreateHighlightRo from '@/common/types/ro/highlights/create-highlight.type';

export default function buildCreateHighlightRo(
	range: Range,
	color: string
): TCreateHighlightRo | null {
	if (!range.startContainer.textContent || !range.endContainer.textContent) return null;

	const sameToStartContainerNodes = findNodesByText(range.startContainer.textContent);
	const sameToEndContainerNodes = findNodesByText(range.endContainer.textContent);

	const startNodeIndex = sameToStartContainerNodes.indexOf(range.startContainer);
	const endNodeIndex = sameToEndContainerNodes.indexOf(range.endContainer);

	return {
		pageUrl: location.href,
		startOffset: range.startOffset,
		endOffset: range.endOffset,
		startContainer: {
			text: range.startContainer.textContent,
			indexNumber: startNodeIndex,
			sameElementsAmount: sameToStartContainerNodes.length,
		},
		endContainer: {
			text: range.endContainer.textContent,
			indexNumber: endNodeIndex,
			sameElementsAmount: sameToEndContainerNodes.length,
		},
		text: range.toString(),
		color,
	};
}
