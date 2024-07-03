import React from 'react';
import { SettingsIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/react';

import HighlightsListTabs from './components/highlights-list-tabs';

import { FULL_OPTIONS_ROUTES } from '@/common/constants/routes/options';
import openTab from '@/common/helpers/open-tab.helper';

export default function Sidepanel(): JSX.Element {
	return (
		<main className="sidepanel">
			<header className="sidepanel_header">
				<Tooltip
					label="Settings"
					fontSize="md"
					placement="left"
				>
					<SettingsIcon
						onClick={() => openTab(FULL_OPTIONS_ROUTES.pages)}
						height={7}
						width={7}
						color="gray.400"
						cursor="pointer"
					/>
				</Tooltip>
			</header>
			<section className="highlightsList">
				<HighlightsListTabs />
			</section>
		</main>
	);
}
