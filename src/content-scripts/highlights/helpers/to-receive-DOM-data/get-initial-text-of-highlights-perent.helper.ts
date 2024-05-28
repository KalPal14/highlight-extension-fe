export default function getHighlightPerentInitialText(
	perentElement: HTMLElement | null
): string | null {
	if (!perentElement) return null;

	if (perentElement.tagName === 'WEB-HIGHLIGHT') {
		return getHighlightPerentInitialText(perentElement.parentElement);
	}

	return perentElement.getAttribute('data-initial-text');
}
