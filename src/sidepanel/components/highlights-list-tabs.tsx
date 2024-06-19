import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';

import highlightsTabs from '../constants/highlights-tabs';

import HighlightsList from './highlights-list';

export default function HighlightsListTabs(): JSX.Element {
	return (
		<Tabs
			variant="soft-rounded"
			colorScheme="green"
			className="highlightsList_tabs"
		>
			<div className="highlightsList_tabsListContainer">
				<TabList>
					{highlightsTabs.map(({ label }, index) => (
						<Tab key={index}>{label}</Tab>
					))}
				</TabList>
			</div>
			<TabPanels>
				{highlightsTabs.map(({ name }, index) => (
					<TabPanel key={index}>
						<HighlightsList tabName={name} />
					</TabPanel>
				))}
			</TabPanels>
		</Tabs>
	);
}
