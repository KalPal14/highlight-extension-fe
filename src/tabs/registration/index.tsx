import React from 'react';
import { Link } from 'react-router-dom';

import { tabsRoutes } from '@/common/constants/routes/tabs';
import './registration.scss';

export default function RegistrationPage(): JSX.Element {
	return (
		<div>
			<h1>Registration Page</h1>
			<Link to={tabsRoutes.login}>LoginPage</Link>
		</div>
	);
}
