import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Divider, Text, Tooltip } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';

import IChangeHighlightForm from '../types/change-highlight-form.interface';

import IBaseHighlightDto from '@/common/types/dto/highlights/base/base-highlight.interface';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';

export interface IHighlightsListItemProps {
	register: UseFormRegister<IChangeHighlightForm>;
	highlight: IBaseHighlightDto;
	index: number;
}

export default function HighlightsListItem({
	register,
	highlight,
	index,
}: IHighlightsListItemProps): JSX.Element {
	const [, setScrollHighlightId] = useCrossExtState<`web-highlight-${number}` | null>(
		'scrollHighlightId',
		null
	);
	const [unfoundHighlightsIds] = useCrossExtState<number[]>('unfoundHighlightsIds', []);

	const unfoundHighlight = unfoundHighlightsIds.includes(highlight.id);

	return (
		<div
			{...register(`highlights.${index}`, {})}
			className="highlightsList_itemContent"
		>
			{unfoundHighlight && (
				<Tooltip label="This note is only in the sidebar">
					<WarningTwoIcon
						className="highlightsList_itemWarningIcon"
						color="orange.400"
					/>
				</Tooltip>
			)}
			<Text
				onClick={() => setScrollHighlightId(`web-highlight-${highlight.id}`)}
				cursor={unfoundHighlight ? 'text' : 'pointer'}
				fontSize="md"
				color={highlight.color}
			>
				{highlight.text}
			</Text>
			{highlight.note && (
				<>
					<Divider
						className="highlightsList_itemContentDivider"
						borderColor="gray.400"
					/>
					<Text
						fontSize="md"
						color="gray.400"
					>
						{highlight.note}
					</Text>
				</>
			)}
		</div>
	);
}
