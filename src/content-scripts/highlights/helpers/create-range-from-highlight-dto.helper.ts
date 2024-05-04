import findNodesByText from './find-nodes-by-text.helper';

import IBaseHighlightDto from '@/common/types/dto/highlights/base-highlight.interface';

export default function createRangeFromHighlightDto(highlight: IBaseHighlightDto): Range {
	const sameToStartContainerNodes = findNodesByText(highlight.startContainer.text);
	const sameToEndContainerNodes = findNodesByText(highlight.endContainer.text);

	const startNode = sameToStartContainerNodes[highlight.startContainer.indexNumber];
	const endNode = sameToEndContainerNodes[highlight.endContainer.indexNumber];

	const newRange = new Range();
	newRange.setStart(startNode, highlight.startOffset);
	newRange.setEnd(endNode, highlight.endOffset);

	return newRange;
}
