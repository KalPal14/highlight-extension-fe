import React from 'react';
import { Route, Routes } from 'react-router-dom';

import PagesPage from './pages';
import LoginPage from './login';
import RegistrationPage from './registration';

import { tabsRoutes } from '@/common/constants/routes/tabs';

export default function Tabs(): JSX.Element {
	return (
		<Routes>
			<Route
				path={tabsRoutes.login}
				element={<LoginPage />}
			/>
			<Route
				path={tabsRoutes.registration}
				element={<RegistrationPage />}
			/>
			<Route
				path={tabsRoutes.pages}
				element={<PagesPage />}
			/>
		</Routes>
	);
}
