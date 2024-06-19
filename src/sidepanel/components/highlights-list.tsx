import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Heading } from '@chakra-ui/react';

import IChangeHighlightForm from '../types/change-highlight-form.interface';

import HighlightsListItem from './highlights-list-item';

import SortableFields from '@/common/ui/fields/sortable-fields';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import ApiServise from '@/common/services/api.service';
import TGetPageRo from '@/common/types/ro/pages/get-page.type';
import TGetPageDto from '@/common/types/dto/pages/get-page.type';
import { PAGES_API_ROUTES } from '@/common/constants/api-routes/pages';
import { HTTPError } from '@/errors/http-error/http-error';
import { HIGHLIGHTS_API_ROUTES } from '@/common/constants/api-routes/highlights';
import IDeleteHighlightDto from '@/common/types/dto/highlights/delete-highlight.interface';
import ICreateHighlightDto from '@/common/types/dto/highlights/create-highlight.interface';
import IUpdateHighlightDto from '@/common/types/dto/highlights/update-highlight.interface';

export default function HighlightsList(): JSX.Element {
	const pageUrl = new URL(window.location.href).searchParams.get('url');

	const [createdHighlight] = useCrossExtState<ICreateHighlightDto | null>('createdHighlight', null);
	const [deletedHighlight, setDeletedHighlight] = useCrossExtState<IDeleteHighlightDto | null>(
		'deletedHighlight',
		null
	);
	const [updatedHighlight] = useCrossExtState<IUpdateHighlightDto | null>('updatedHighlight', null);

	const { control, register, setValue } = useForm<IChangeHighlightForm>({
		values: {
			highlights: [],
		},
	});
	const useFieldArrayReturn = useFieldArray({
		control,
		name: 'highlights',
	});
	const { fields, append, remove, update } = useFieldArrayReturn;

	useEffect(() => {
		if (!createdHighlight) return;
		append({ highlight: createdHighlight });
	}, [createdHighlight]);

	useEffect(() => {
		if (!deletedHighlight) return;
		const index = findFieldIndex(deletedHighlight.id);
		if (index === -1 || fields[index].highlight.id !== deletedHighlight.id) return;

		remove(index);
	}, [deletedHighlight]);

	useEffect(() => {
		if (!updatedHighlight) return;
		const index = findFieldIndex(updatedHighlight.id);
		update(index, { highlight: updatedHighlight });
	}, [updatedHighlight]);

	useEffect(() => {
		getHighlights();
	}, [pageUrl]);

	function findFieldIndex(id: number): number {
		return fields.findIndex((field) => field.highlight.id === id);
	}

	async function getHighlights(): Promise<void> {
		if (!pageUrl) return;
		const resp = await new ApiServise().get<TGetPageRo, TGetPageDto>(PAGES_API_ROUTES.getPage, {
			url: pageUrl,
		});
		if (resp instanceof HTTPError) return;
		if (resp.id === null) return;
		const highlights = resp.highlights?.map((highlight) => ({
			highlight,
		}));
		setValue('highlights', highlights ?? []);
	}

	async function onDeleteHighlight(index: number): Promise<void> {
		const { highlight } = fields[index];

		const resp = await new ApiServise().delete<null, IDeleteHighlightDto>(
			HIGHLIGHTS_API_ROUTES.delete(highlight.id)
		);
		if (resp instanceof HTTPError) return;
		setDeletedHighlight(resp);
	}

	if (!fields.length) {
		return (
			<Heading
				as="h6"
				size="md"
				textAlign="center"
			>
				This list of highlights is empty
			</Heading>
		);
	}

	return (
		<SortableFields
			useFieldArrayReturn={useFieldArrayReturn}
			showDeleteBtn={true}
			onDelete={onDeleteHighlight}
			fieldsList={fields.map(({ highlight }, index) => (
				<HighlightsListItem
					key={highlight.id}
					register={register}
					highlight={highlight}
					index={index}
				/>
			))}
		/>
	);
}
