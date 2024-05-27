export default function getHighlightPerent(node: Node | HTMLElement | null): HTMLElement | null {
	if (!node || !node.parentElement) return null;
	if (node.parentElement.tagName === 'WEB-HIGHLIGHT') {
		return getHighlightPerent(node.parentElement);
	}
	return node.parentElement;
}
