import React from 'react';

import './highlights.scss';
import { fullTabsRoutes } from '@/common/constants/routes/tabs';

export default function Highlights(): JSX.Element {
	return (
		<div className="highlights">
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(fullTabsRoutes.login));
				}}
			>
				LoginPage
			</button>
		</div>
	);
}
