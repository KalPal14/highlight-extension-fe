export default function getNestedHighlightsIds(initialElement: Element): number[] {
	const ids: number[] = [];

	find(initialElement);

	function find(element: Element): void {
		for (let i = 0; i < element.children.length; i++) {
			const child = element.children.item(i);
			if (!child) continue;
			if (child?.tagName === 'WEB-HIGHLIGHT') {
				const id = Number(child.id.split('web-highlight-')[1]);
				ids.push(id);
			}
			find(child);
		}
	}
	return ids;
}
