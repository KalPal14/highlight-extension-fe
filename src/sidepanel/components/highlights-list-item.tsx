import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Divider, Text } from '@chakra-ui/react';

import IChangeHighlightForm from '../types/change-highlight-form.interface';

import IBaseHighlightDto from '@/common/types/dto/highlights/base/base-highlight.interface';

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
	return (
		<div
			{...register(`highlights.${index}`, {})}
			className="highlightsList_itemContent"
		>
			<Text
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
