import React, { useEffect, useState } from 'react';

import './highlights.scss';

interface ITextNodeToHighlight {
	node: Node;
	info: IStringInRangeInfo;
}

interface IStringInRangeInfo {
	strBeforeRange: string;
	strInRange: string;
	strAfterRange: string;
}

export default function Highlights(): JSX.Element {
	const [range, setRange] = useState<Range>();

	useEffect(() => {
		document.addEventListener('mouseup', ({ target }): void => {
			if ((target as HTMLElement).id === 'highlights_div') return;

			const newSelection = document.getSelection();
			if (!newSelection) return;

			const newRange = newSelection.getRangeAt(0);
			setRange(newRange);
		});
	}, []);

	function createHighlight(): void {
		if (!range) return;

		const textNodeToHighlightList: ITextNodeToHighlight[] = [];
		const commonContainer = range.commonAncestorContainer;
		findTextToHighlight(commonContainer, range, textNodeToHighlightList);
		// console.log('============================================================================');
		// console.log(textNodeToHighlightList);
		// console.log('============================================================================');
		textNodeToHighlightList.forEach(({ node, info }) => {
			wrapTextToHighlighterElement(node, info);
		});
	}

	function findTextToHighlight(
		commonContainer: Node,
		range: Range,
		textNodeToHighlightList: ITextNodeToHighlight[]
	): void {
		if (commonContainer.nodeType === Node.TEXT_NODE) {
			// console.log('========ARGUMENT IS TEXT_NODE=========');
			if (!commonContainer.textContent?.trim()) return;
			console.log('commonContainer.textContent', commonContainer.textContent);
			const stringInRangeInfo = getTextNodeContentInRange(commonContainer, range);
			// console.log('=========RESULT=========');
			if (!stringInRangeInfo || !stringInRangeInfo.strInRange) {
				// console.log('IN TEXT_NODE: ', commonContainer, 'WE DON`T HAVE ANYSING TO HIGHLIGHT');
				return;
			}
			// console.log(
			// 	'IN TEXT_NODE: ',
			// 	commonContainer,
			// 	'WE MUST HIGHLIGHT: ',
			// 	stringInRangeInfo.strInRange
			// );
			textNodeToHighlightList.push({
				node: commonContainer,
				info: stringInRangeInfo,
			});
		} else {
			// console.log('========ARGUMENT IS NOT TEXT_NODE=========');
			// console.log(commonContainer);
			const childNodes = commonContainer.childNodes;
			for (let i = 0; i < childNodes.length; i++) {
				const childNode = childNodes.item(i);
				findTextToHighlight(childNode, range, textNodeToHighlightList);
			}
		}
	}

	function getTextNodeContentInRange(textNode: Node, range: Range): IStringInRangeInfo | null {
		if (textNode.nodeType !== Node.TEXT_NODE) {
			// console.log('ERRR: Переданая нода не текстовая нода');
			return null;
		}
		if (!textNode.textContent) {
			// console.log('У этой текстовой ноды нет текста');
			return null;
		}
		// console.log('Передана правильная текстовая нода: ', textNode);
		let strBeforeRange = '';
		let strInRange = '';
		let strAfterRange = '';

		if (isAllTextInRange(textNode, range)) {
			console.log('МЫ СЭКОНОМИЛИ!!!! УРА!!!!');
			strInRange = textNode.textContent;
			return { strBeforeRange, strInRange, strAfterRange };
		}

		for (let i = 0; i < textNode.textContent.length; i++) {
			const isInRange = range.comparePoint(textNode, i);
			switch (isInRange) {
				case -1:
					strBeforeRange = strBeforeRange + textNode.textContent[i];
					break;
				case 0:
					strInRange = strInRange + textNode.textContent[i];
					break;
				case 1:
					strAfterRange = strAfterRange + textNode.textContent[i];
					break;
			}
		}
		return { strBeforeRange, strInRange, strAfterRange };
	}

	function isAllTextInRange(textNode: Node, range: Range): boolean {
		if (!textNode.textContent) return false;
		const isFirstInRange = range.comparePoint(textNode, 0);
		const isLastInRange = range.comparePoint(textNode, textNode.textContent.length - 1);
		return isFirstInRange === 0 && isLastInRange === 0 ? true : false;
	}

	async function wrapTextToHighlighterElement(
		textNode: Node,
		{ strBeforeRange, strAfterRange, strInRange }: IStringInRangeInfo
	): Promise<void> {
		// console.log('========REDY TO HIGHLIGHT=========');
		if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent || !textNode.parentElement) {
			// console.log('ERRR: Переданая нода не текстовая нода');
			return;
		}
		// console.log(textNode, '++++++++++', strInRange);
		const wrapper = createHighlighterElement(textNode.textContent, strInRange);
		await textNode.parentElement.replaceChild(wrapper, textNode);
		await wrapper.before(strBeforeRange);
		await wrapper.after(strAfterRange);
		// // console.log(wrapper, wrapper.parentElement);
	}

	function createHighlighterElement(allText: string, textToHighlight: string): HTMLSpanElement {
		const span = document.createElement('web-highlight');
		span.style.backgroundColor = '#1488';
		span.addEventListener('click', () => {
			console.log('You clicked on the highlighter!!!');
		});
		span.innerText = textToHighlight;
		return span;
	}

	if (range) {
		return (
			<div
				id="highlights_div"
				onClick={createHighlight}
				className="highlights_div"
			></div>
		);
	}

	return <></>;
}
