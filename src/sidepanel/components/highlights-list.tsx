import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Heading } from '@chakra-ui/react';

import IChangeHighlightForm from '../types/change-highlight-form.interface';
import THighlightsTabName from '../types/highlights-tab-name.type';

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
import IUpdateHighlightDto from '@/common/types/dto/highlights/update-highlight.interface';
import TIndividualUpdateHighlightsRo from '@/common/types/ro/highlights/individual-update-highlights.type';
import ICreateHighlightExtState from '@/common/types/cross-ext-state/created-highlight-ext-state.interface';
import IDeletedHighlightExtState from '@/common/types/cross-ext-state/deleted-highlight-ext-state.interface';
import IUpdatedHighlightExtState from '@/common/types/cross-ext-state/updated-highlight-ext-state.interface';

export interface IHighlightsListProps {
	tabName: THighlightsTabName;
}

export default function HighlightsList({ tabName }: IHighlightsListProps): JSX.Element {
	const pageUrl = new URL(window.location.href).searchParams.get('url');

	const [createdHighlight] = useCrossExtState<ICreateHighlightExtState | null>(
		'createdHighlight',
		null
	);
	const [deletedHighlight, setDeletedHighlight] =
		useCrossExtState<IDeletedHighlightExtState | null>('deletedHighlight', null);
	const [updatedHighlight] = useCrossExtState<IUpdatedHighlightExtState | null>(
		'updatedHighlight',
		null
	);
	const [unfoundHighlightsIds] = useCrossExtState<number[]>('unfoundHighlightsIds', []);

	const { control, register, setValue, watch } = useForm<IChangeHighlightForm>({
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
		if (!createdHighlight || createdHighlight.pageUrl !== pageUrl) return;
		append({ highlight: createdHighlight.highlight });
	}, [createdHighlight]);

	useEffect(() => {
		if (!deletedHighlight || deletedHighlight.pageUrl !== pageUrl) return;
		const index = findFieldIndex(deletedHighlight.highlight.id);
		if (index === -1 || fields[index].highlight.id !== deletedHighlight.highlight.id) return;

		remove(index);
	}, [deletedHighlight]);

	useEffect(() => {
		if (!updatedHighlight || updatedHighlight.pageUrl !== pageUrl) return;
		const index = findFieldIndex(updatedHighlight.highlight.id);
		update(index, { highlight: updatedHighlight.highlight });
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
		setDeletedHighlight({ highlight: resp, pageUrl: pageUrl ?? '' });
	}

	async function onHighlightsSortEnd(): Promise<void> {
		const highlights = watch('highlights');
		const dataToUpdate = highlights
			.map(({ highlight: { order, id } }, index) => {
				if (order !== index + 1) {
					return { id, payload: { order: index + 1 } };
				}
				return null;
			})
			.filter((highlight) => highlight !== null);

		if (!dataToUpdate.length) return;

		await new ApiServise().patch<TIndividualUpdateHighlightsRo, IUpdateHighlightDto[]>(
			HIGHLIGHTS_API_ROUTES.individualUpdateMany,
			{
				highlights: dataToUpdate,
			} as TIndividualUpdateHighlightsRo
		);
	}

	function getFieldsIdsByTab(): number[] {
		const highlightsIds = fields.map(({ highlight }) => highlight.id);
		switch (tabName) {
			case 'all':
				return highlightsIds;
			case 'found':
				return highlightsIds.filter((id) => isFound(id));
			case 'unfound':
				return highlightsIds.filter((id) => !isFound(id));
		}

		function isFound(id: number): boolean {
			return !unfoundHighlightsIds.includes(id);
		}
	}
	const fieldsIdsToRender = getFieldsIdsByTab();

	if (!fieldsIdsToRender.length) {
		return (
			<Heading
				as="h6"
				size="md"
				textAlign="center"
			>
				This list is empty
			</Heading>
		);
	}

	return (
		<SortableFields
			useFieldArrayReturn={useFieldArrayReturn}
			showDeleteBtn={true}
			onDelete={onDeleteHighlight}
			onSortEnd={onHighlightsSortEnd}
			fieldsList={fields.map(({ highlight }, index) => {
				if (!fieldsIdsToRender.includes(highlight.id)) return null;
				return (
					<HighlightsListItem
						key={highlight.id}
						register={register}
						highlight={highlight}
						index={index}
					/>
				);
			})}
		/>
	);
}
