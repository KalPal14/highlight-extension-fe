import React from 'react';
import { Route, Routes } from 'react-router-dom';

import PagesPage from './pages';
import LoginPage from './login';
import RegistrationPage from './registration';

import { TABS_ROUTES } from '@/common/constants/routes/tabs';

export default function Tabs(): JSX.Element {
	return (
		<Routes>
			<Route
				path={TABS_ROUTES.login}
				element={<LoginPage />}
			/>
			<Route
				path={TABS_ROUTES.registration}
				element={<RegistrationPage />}
			/>
			<Route
				path={TABS_ROUTES.pages}
				element={<PagesPage />}
			/>
		</Routes>
	);
}
