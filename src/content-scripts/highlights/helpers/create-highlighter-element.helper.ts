import IBaseHighlightDto from '@/common/types/dto/highlights/base/base-highlight.interface';

export default function createHighlighterElement(
	textToHighlight: string,
	{ id, color, note }: IBaseHighlightDto
): HTMLSpanElement {
	const span = document.createElement('web-highlight');
	span.style.backgroundColor = color;
	span.id = `web-highlight-${id}`;
	span.innerText = textToHighlight;
	span.setAttribute('data-higlight-note', note ?? '');

	return span;
}
