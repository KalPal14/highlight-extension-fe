import React, { useEffect, useState } from 'react';

import './highlights.scss';
import findTextToHighlight from './helpers/find-text-to-highlight.helper';
import INodeInRangeTextContent from './types/node-in-range-text-content.interface';

import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import ApiServise from '@/common/services/api.service';
import IGetUserInfoDto from '@/common/types/dto/users/get-user-info.interface';
import { HTTPError } from '@/errors/http-error';
import { DEF_COLORS } from '@/common/constants/colors';
import IColor from '@/common/types/color.interface';

export default function Highlights(): JSX.Element {
	const [colors, setColors] = useState<IColor[]>(DEF_COLORS);
	const [range, setRange] = useState<Range | null>(null);

	useEffect(() => {
		getUserInfo();
		document.addEventListener('mouseup', selectionHandler);

		return () => window.removeEventListener('mouseup', selectionHandler);
	}, []);

	async function getUserInfo(): Promise<void> {
		const resp = await new ApiServise().get<null, IGetUserInfoDto>(USERS_API_ROUTES.getUserInfo);
		if (resp instanceof HTTPError) return;
		setColors(resp.colors);
	}

	function selectionHandler({ target }: MouseEvent): void {
		if ((target as HTMLElement).className.includes('highlighController')) return;

		const newSelection = document.getSelection();
		if (!newSelection || newSelection.type !== 'Range') {
			setRange(null);
			return;
		}

		const newRange = newSelection.getRangeAt(0);
		setRange(newRange);
	}

	function createHighlight(color: string): void {
		if (!range) return;

		const nodesInRangeList = findTextToHighlight(range.commonAncestorContainer, range);

		nodesInRangeList.forEach(({ node, textContent }, index) => {
			// This must be done because the built-in range method 'comparePoint'
			// assigns an extra letter to the last element
			if (index === nodesInRangeList.length - 1) {
				const lastNodeText = removeExtraLetterFromRange(textContent);
				wrapTextWithHighlighter(node, lastNodeText, color);
				return;
			}
			wrapTextWithHighlighter(node, textContent, color);
		});
		setRange(null);
	}

	function removeExtraLetterFromRange({
		strBeforeRange,
		strInRange,
		strAfterRange,
	}: INodeInRangeTextContent): INodeInRangeTextContent {
		return {
			strBeforeRange,
			strInRange: strInRange.slice(0, strInRange.length - 1),
			strAfterRange: strInRange[strInRange.length - 1] + strAfterRange,
		};
	}

	function wrapTextWithHighlighter(
		textNode: Node,
		{ strBeforeRange, strAfterRange, strInRange }: INodeInRangeTextContent,
		color: string
	): void {
		if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent || !textNode.parentElement) {
			return;
		}

		const wrapper = createHighlighterElement(strInRange, color);
		textNode.parentElement.replaceChild(wrapper, textNode);
		wrapper.before(strBeforeRange);
		wrapper.after(strAfterRange);
	}

	function createHighlighterElement(textToHighlight: string, color: string): HTMLSpanElement {
		const span = document.createElement('web-highlight');
		span.style.backgroundColor = color;
		span.addEventListener('click', () => {
			console.log('You clicked on the highlighter!');
		});
		span.innerText = textToHighlight;
		return span;
	}

	if (range) {
		return (
			<div className="highlighController">
				{colors.map(({ color }, index) => (
					<div
						key={index}
						onClick={() => createHighlight(color)}
						className="highlighController_color"
						style={{
							backgroundColor: color,
						}}
					></div>
				))}
			</div>
		);
	}

	return <></>;
}
