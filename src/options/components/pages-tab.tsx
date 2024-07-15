import React, { useEffect, useState } from 'react';
import { Accordion } from '@chakra-ui/react';

import PageItem from './page-item';

import ApiServise from '@/common/services/api.service';
import { PAGES_API_ROUTES } from '@/common/constants/api-routes/pages';
import TGetPagesDto from '@/common/types/dto/pages/get-pages.type';

export default function PagesTab(): JSX.Element {
	const [pages, setPages] = useState<TGetPagesDto>([]);

	useEffect(() => {
		getPagesInfo();
	}, []);

	async function getPagesInfo(): Promise<void> {
		const resp = await new ApiServise().get<null, TGetPagesDto>(PAGES_API_ROUTES.getPages);
		if (resp instanceof Error) return;
		setPages(resp.filter(({ highlightsCount }) => highlightsCount));
	}

	return (
		<section className="options_pagesTab">
			<Accordion allowMultiple>
				{pages.map((page) => (
					<PageItem
						key={page.id}
						page={page}
						onUpdatePage={getPagesInfo}
					/>
				))}
			</Accordion>
		</section>
	);
}
