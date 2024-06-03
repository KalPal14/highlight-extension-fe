import React from 'react';
import { Link } from 'react-router-dom';
import { Text, Heading } from '@chakra-ui/react';

import './registration.scss';
import RegistrationForm from './components/registration-form';

import { TABS_ROUTES } from '@/common/constants/routes/tabs';
import HighAlert from '@/common/ui/alerts/high-alert';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';

export default function RegistrationPage(): JSX.Element {
	const [jwt] = useCrossExtState<string | null>('jwt', null);

	return (
		<div className="registrationPage">
			{!jwt && (
				<section className="registrationPage_formSection">
					<Heading as="h1">Registration</Heading>
					<Text>
						Want to log into an existing account?{' '}
						<Text
							color="teal.500"
							as="u"
							cursor="pointer"
						>
							<Link to={TABS_ROUTES.login}>Please login here</Link>
						</Text>
					</Text>
					<RegistrationForm />
				</section>
			)}
			{Boolean(jwt) && (
				<HighAlert
					title="You have successfully registered"
					description="You can close this tab. To register a new account, please log out of the current on"
					status="success"
					className="registrationPage_alert"
				/>
			)}
		</div>
	);
}
