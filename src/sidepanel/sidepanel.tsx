import React from 'react';

import HighlightsList from './components/highlights-list';

export default function Sidepanel(): JSX.Element {
	return (
		<section className="highlightsList">
			<HighlightsList />
		</section>
	);
}
