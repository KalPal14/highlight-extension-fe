export default function isAllTextInRange(textNode: Node, range: Range): boolean {
	if (!textNode.textContent) return false;
	const isFirstInRange = range.comparePoint(textNode, 0);
	const isLastInRange = range.comparePoint(textNode, textNode.textContent.length);
	return isFirstInRange === 0 && isLastInRange === 0 ? true : false;
}
