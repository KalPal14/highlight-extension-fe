import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Heading } from '@chakra-ui/react';

import './registration.scss';
import RegistrationForm from './components/registration-form';

import { TABS_ROUTES } from '@/common/constants/routes/tabs';
import HighAlert, { IHighAlertProps } from '@/common/ui/alerts/high-alert';

export default function RegistrationPage(): JSX.Element {
	const [highAlert, setHighAlert] = useState<IHighAlertProps | null>(null);

	useEffect(() => {
		chrome.storage.onChanged.addListener(loginCheck);
		loginCheck();

		return () => chrome.storage.onChanged.removeListener(loginCheck);
	}, []);

	async function loginCheck(): Promise<void> {
		const { token } = await chrome.storage.local.get('token');
		if (token) {
			setHighAlert({
				title: 'You have successfully registered',
				description:
					'You can close this tab. To register a new account, please log out of the current on',
			});
		}
	}

	return (
		<div className="registrationPage">
			{!highAlert && (
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
			{Boolean(highAlert) && (
				<HighAlert
					title={highAlert!.title}
					description={highAlert!.description}
					status={highAlert?.status}
					className="registrationPage_alert"
				/>
			)}
		</div>
	);
}
