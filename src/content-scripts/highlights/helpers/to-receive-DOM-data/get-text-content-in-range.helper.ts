import INodeInRangeTextContent from '../../types/node-in-range-text-content.interface';

import isAllTextInRange from './is-all-text-in-range.helper';

export default function getTextContentInRange(
	textNode: Node,
	range: Range
): INodeInRangeTextContent | null {
	if (textNode.nodeType !== Node.TEXT_NODE) return null;
	if (!textNode.textContent) return null;

	let strBeforeRange = '';
	let strInRange = '';
	let strAfterRange = '';

	if (isAllTextInRange(textNode, range)) {
		strInRange = textNode.textContent;
		return { strBeforeRange, strInRange, strAfterRange, isAllInRange: true };
	}

	for (let i = 0; i < textNode.textContent.length; i++) {
		const isInRange = range.comparePoint(textNode, i);

		switch (isInRange) {
			case -1:
				strBeforeRange = strBeforeRange + textNode.textContent[i];
				break;
			case 0:
				strInRange = strInRange + textNode.textContent[i];
				break;
			case 1:
				strAfterRange = strAfterRange + textNode.textContent[i];
				break;
		}
	}

	return { strBeforeRange, strInRange, strAfterRange };
}
