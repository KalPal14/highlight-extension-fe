export default function findElementsByInitialText(
	text: string,
	startElement: Element = document.body
): Element[] {
	const result: Element[] = [];

	find(startElement);

	function find(element: Element): void {
		const initialText = element.getAttribute('data-initial-text');
		if (initialText === text && element.tagName !== 'WEB-HIGHLIGHT') {
			result.push(element);
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
