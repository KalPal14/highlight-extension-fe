import setInitialTextToHighlightPerent from '../for-DOM-changes/set-initial-text-to-highlight-perent.helper';

export default function findElementsByText(
	text: string,
	startElement: Element = document.body
): Element[] {
	const onlyChartersText = text.replace(/\s/g, '');
	const result: Element[] = [];

	find(startElement);

	function find(element: Element): void {
		if (!element.textContent) return;
		const onlyChartersTextContent = element.textContent.replace(/\s/g, '');
		if (onlyChartersTextContent === onlyChartersText && element.tagName !== 'WEB-HIGHLIGHT') {
			result.push(element);
			setInitialTextToHighlightPerent(element);
		}
		for (let i = 0; i < element.children.length; i++) {
			const childElement = element.children.item(i);
			if (childElement) {
				find(childElement);
			}
		}
	}
	return result;
}
