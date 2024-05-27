export default function setInitialTextToHighlightPerent(perentElement: HTMLElement | null): void {
	if (!perentElement) return;

	if (perentElement.tagName === 'WEB-HIGHLIGHT') {
		setInitialTextToHighlightPerent(perentElement.parentElement);
		return;
	}

	const initialText = perentElement.getAttribute('data-initial-text');
	if (initialText) return;
	perentElement.setAttribute('data-initial-text', perentElement.textContent ?? '');
}
