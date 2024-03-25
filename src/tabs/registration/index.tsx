import React from 'react';
import { Link } from 'react-router-dom';

import { TABS_ROUTES } from '@/common/constants/routes/tabs';
import './registration.scss';

export default function RegistrationPage(): JSX.Element {
	return (
		<div>
			<h1>Registration Page</h1>
			<Link to={TABS_ROUTES.login}>LoginPage</Link>
		</div>
	);
}
