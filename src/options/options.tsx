import React from 'react';

import './options.scss';
import { fullTabsRoutes } from '@/common/constants/routes/tabs';

const OptionsPage = (): JSX.Element => {
	return (
		<div className="options">
			<h1>OptionsPage</h1>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(fullTabsRoutes.pages));
				}}
			>
				PagesPage
			</button>
		</div>
	);
};

export default OptionsPage;
