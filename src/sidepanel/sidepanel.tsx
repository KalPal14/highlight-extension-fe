import React from 'react';

import HighlightsListTabs from './components/highlights-list-tabs';

export default function Sidepanel(): JSX.Element {
	return (
		<section className="highlightsList">
			<HighlightsListTabs />
		</section>
	);
}
