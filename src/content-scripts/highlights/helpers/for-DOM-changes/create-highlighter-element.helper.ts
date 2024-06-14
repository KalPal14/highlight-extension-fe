import IBaseHighlightDto from '@/common/types/dto/highlights/base/base-highlight.interface';

export default function createHighlighterElement(
	textToHighlight: string,
	{ id, color, note }: IBaseHighlightDto
): HTMLSpanElement {
	const webHighlight = document.createElement('web-highlight');
	webHighlight.style.backgroundColor = `${color}${80}`;
	webHighlight.style.transition = 'background-color 300ms linear';
	webHighlight.id = `web-highlight-${id}`;
	webHighlight.innerText = textToHighlight;
	webHighlight.setAttribute('data-higlight-note', note ?? '');
	webHighlight.setAttribute('data-initial-text', textToHighlight);
	removeBr(webHighlight);
	return webHighlight;
}

function removeBr(element: HTMLElement): void {
	const childElements = element.children;
	for (let i = 0; i < childElements.length; i++) {
		childElements.item(i)?.remove();
	}
}
