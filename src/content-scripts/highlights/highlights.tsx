import React from 'react';

import './highlights.scss';
import { FULL_TABS_ROUTES } from '@/common/constants/routes/tabs';

export default function Highlights(): JSX.Element {
	return (
		<div className="highlights">
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(FULL_TABS_ROUTES.login));
				}}
			>
				LoginPage
			</button>
		</div>
	);
}
