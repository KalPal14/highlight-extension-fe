import React, { useEffect, useState } from 'react';
import { Accordion } from '@chakra-ui/react';

import PageItem from './page-item';

import ApiServise from '@/common/services/api.service';
import { PAGES_API_ROUTES } from '@/common/constants/api-routes/pages';
import TGetPagesDto from '@/common/types/dto/pages/get-pages.type';
import IUpdatePageDto from '@/common/types/dto/pages/update-page.interface';

export default function PagesTab(): JSX.Element {
	const [pages, setPages] = useState<TGetPagesDto>([]);

	useEffect(() => {
		getPagesInfo();
	}, []);

	async function getPagesInfo(): Promise<void> {
		const resp = await new ApiServise().get<null, TGetPagesDto>(PAGES_API_ROUTES.getPages);
		if (resp instanceof Error) return;
		setPages(resp);
	}

	function onUpdatePageHandler(updatedPage: IUpdatePageDto): void {
		const newPages = pages.map((page) => {
			if (page.id === updatedPage.id) {
				return {
					...page,
					...updatedPage,
				};
			}
			return page;
		});
		setPages(newPages);
	}

	return (
		<section className="options_pagesTab">
			<Accordion allowMultiple>
				{pages.map((page) => (
					<PageItem
						key={page.id}
						page={page}
						onUpdatePage={onUpdatePageHandler}
					/>
				))}
			</Accordion>
		</section>
	);
}
