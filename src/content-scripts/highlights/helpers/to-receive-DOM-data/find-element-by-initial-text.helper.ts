export default function findElementsByInitialText(
	text: string,
	startNode: Node = document.body
): Element[] {
	const result: Element[] = [];
	find(startNode);

	function find(node: Node): void {
		if (node.nodeType === Node.TEXT_NODE) {
			if (!node.parentElement) return;
			const initialText = node.parentElement.getAttribute('data-initial-text');
			if (initialText === text) {
				result.push(node.parentElement);
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
