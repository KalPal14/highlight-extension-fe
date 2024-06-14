import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Divider, Text } from '@chakra-ui/react';

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

	return (
		<div
			{...register(`highlights.${index}`, {})}
			className="highlightsList_itemContent"
		>
			<Text
				onClick={() => setScrollHighlightId(`web-highlight-${highlight.id}`)}
				cursor="pointer"
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
