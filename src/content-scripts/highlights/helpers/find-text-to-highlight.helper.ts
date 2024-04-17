import INodeInRange from '../types/node-in-range.interface';

import getTextContentInRange from './get-text-content-in-range.helper';

export default function findTextToHighlight(startNode: Node, range: Range): INodeInRange[] {
	const textNodeToHighlightList: INodeInRange[] = [];

	find(startNode);

	function find(node: Node): void {
		if (node.nodeType === Node.TEXT_NODE) {
			if (!node.textContent?.trim()) return;

			const nodeInRangeTextContent = getTextContentInRange(node, range);
			if (!nodeInRangeTextContent || !nodeInRangeTextContent.strInRange) return;
			textNodeToHighlightList.push({
				node,
				textContent: nodeInRangeTextContent,
			});
		} else {
			const childNodes = node.childNodes;
			for (let i = 0; i < childNodes.length; i++) {
				const childNode = childNodes.item(i);
				find(childNode);
			}
		}
	}

	return textNodeToHighlightList;
}
