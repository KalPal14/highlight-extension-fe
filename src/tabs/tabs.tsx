import React from 'react';
import { Route, Routes } from 'react-router-dom';

import PagesPage from './pages/pages-page';
import LoginPage from './login/login-page';
import RegistrationPage from './registration/registration-page';

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
