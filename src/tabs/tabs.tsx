import React from 'react';
import { Route, Routes } from 'react-router-dom';

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
		</Routes>
	);
}
