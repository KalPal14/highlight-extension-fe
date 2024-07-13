import INodeInRangeTextContent from '../../types/node-in-range-text-content.interface';
import findTextToHighlight from '../to-receive-DOM-data/find-text-to-highlight.helper';

import createHighlighterElement from './create-highlighter-element.helper';

import IBaseHighlightDto from '@/common/types/dto/highlights/base/base-highlight.interface';

export default function drawHighlight(range: Range, highlight: IBaseHighlightDto): void {
	const nodesInRangeList = findTextToHighlight(range.commonAncestorContainer, range);

	nodesInRangeList.forEach(({ node, textContent }, index) => {
		if (index === nodesInRangeList.length - 1 && !textContent.isAllInRange) {
			const lastNodeText = removeExtraLetterFromRange(textContent);
			wrapTextWithHighlighterElement(node, lastNodeText, highlight);
			return;
		}
		wrapTextWithHighlighterElement(node, textContent, highlight);
	});
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

function wrapTextWithHighlighterElement(
	textNode: Node,
	{ strBeforeRange, strAfterRange, strInRange }: INodeInRangeTextContent,
	highlight: IBaseHighlightDto
): void {
	if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent || !textNode.parentElement) {
		return;
	}

	const wrapper = createHighlighterElement(strInRange, highlight);
	textNode.parentElement.replaceChild(wrapper, textNode);
	wrapper.before(strBeforeRange);
	wrapper.after(strAfterRange);
}
