import React from 'react';

import { FULL_TABS_ROUTES } from '@/common/constants/routes/tabs';
import { ROOT_OPTIONS_ROUTE } from '@/common/constants/routes/options';

import './popup.scss';

export default function Popup(): JSX.Element {
	return (
		<div className="popup">
			<h1>Popup</h1>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(FULL_TABS_ROUTES.login));
				}}
			>
				LoginPage
			</button>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(FULL_TABS_ROUTES.registration));
				}}
			>
				RegistrationPage
			</button>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(ROOT_OPTIONS_ROUTE));
				}}
			>
				OptionsPage
			</button>
			<button
				onClick={() => {
					window.open(chrome.runtime.getURL(FULL_TABS_ROUTES.pages));
				}}
			>
				PagesPage
			</button>
		</div>
	);
}
