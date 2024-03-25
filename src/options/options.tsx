import React from 'react';

import './options.scss';
import { FULL_TABS_ROUTES } from '@/common/constants/routes/tabs';

const OptionsPage = (): JSX.Element => {
	return (
		<div className="options">
			<h1>OptionsPage</h1>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(FULL_TABS_ROUTES.pages));
				}}
			>
				PagesPage
			</button>
		</div>
	);
};

export default OptionsPage;
