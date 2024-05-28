import setInitialTextToHighlightPerent from '../for-DOM-changes/set-initial-text-to-highlight-perent.helper';

export default function findNodesByText(text: string, startNode: Node = document.body): Node[] {
	const result: Node[] = [];

	find(startNode);

	function find(node: Node): void {
		if (node.nodeType === Node.TEXT_NODE) {
			if (node.textContent === text) {
				result.push(node);
				setInitialTextToHighlightPerent(node.parentElement);
			}
			return;
		}
		const childNodes = node.childNodes;
		for (let i = 0; i < childNodes.length; i++) {
			const childNode = childNodes.item(i);
			find(childNode);
		}
	}

	return result;
}