import React from 'react';

import './pages.scss';

export default function PagesPage(): JSX.Element {
	return (
		<div className="pages">
			<h1>PagesPage</h1>
			<button
				onClick={() => {
					window.open('https://example.com/');
				}}
			>
				https://example.com/
			</button>
		</div>
	);
}
