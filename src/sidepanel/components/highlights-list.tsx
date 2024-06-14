import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import IChangeHighlightForm from '../types/change-highlight-form.interface';

import HighlightsListItem from './highlights-list-item';

import SortableFields from '@/common/ui/fields/sortable-fields';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import IBaseHighlightDto from '@/common/types/dto/highlights/base/base-highlight.interface';
import ApiServise from '@/common/services/api.service';
import TGetPageRo from '@/common/types/ro/pages/get-page.type';
import TGetPageDto from '@/common/types/dto/pages/get-page.type';
import { PAGES_API_ROUTES } from '@/common/constants/api-routes/pages';
import { HTTPError } from '@/errors/http-error/http-error';

export default function HighlightsList(): JSX.Element {
	const pageUrl = new URL(window.location.href).searchParams.get('url');

	const [createdHighlight] = useCrossExtState<IBaseHighlightDto | null>('createdHighlight', null);
	const [deletedHighlight] = useCrossExtState<IBaseHighlightDto | null>('deletedHighlight', null);
	const [updatedHighlight] = useCrossExtState<IBaseHighlightDto | null>('updatedHighlight', null);

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

	return (
		<SortableFields
			useFieldArrayReturn={useFieldArrayReturn}
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
