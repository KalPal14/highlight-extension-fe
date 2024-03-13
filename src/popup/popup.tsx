import React from 'react';

import { fullTabsRoutes } from '@/common/constants/routes/tabs';
import { rootOptionsRoute } from '@/common/constants/routes/options';

import './popup.scss';

export default function Popup(): JSX.Element {
	return (
		<div className="popup">
			<h1>Popup</h1>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(fullTabsRoutes.login));
				}}
			>
				LoginPage
			</button>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(fullTabsRoutes.registration));
				}}
			>
				RegistrationPage
			</button>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(rootOptionsRoute));
				}}
			>
				OptionsPage
			</button>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(fullTabsRoutes.pages));
				}}
			>
				PagesPage
			</button>
		</div>
	);
}
