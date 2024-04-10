import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Heading, ScaleFade } from '@chakra-ui/react';

import './login.scss';
import LoginForm from './login-form';

import { TABS_ROUTES } from '@/common/constants/routes/tabs';
import { getCookie } from '@/common/services/cookies.service';
import HighAlert, { IHighAlertProps } from '@/common/ui/alerts/high-alert';

export default function LoginPage(): JSX.Element {
	const [highAlert, setHighAlert] = useState<IHighAlertProps | null>(null);

	useEffect(() => {
		loginCheck();
	}, []);

	async function loginCheck(): Promise<void> {
		const isLoggedIn = await getCookie('token');
		if (isLoggedIn) {
			setHighAlert({
				title: 'You are already logged in to your account',
				description: 'To log in to another account, log out of the current one',
				status: 'info',
			});
		}
	}

	function onSuccessLogin(): void {
		setHighAlert({
			title: 'You have successfully logged in',
			description: 'You can close this tab',
		});
	}

	return (
		<div className="loginPage">
			{!highAlert && (
				<section className="loginPage_formSection">
					<Heading as="h1">Log in</Heading>
					<Text>
						Don't have an account?{' '}
						<Text
							color="teal.500"
							as="u"
							cursor="pointer"
						>
							<Link to={TABS_ROUTES.registration}>Please register</Link>
						</Text>
					</Text>
					<LoginForm onSuccess={onSuccessLogin} />
				</section>
			)}
			{Boolean(highAlert) && (
				<ScaleFade
					initialScale={0.9}
					in={Boolean(highAlert)}
					className="loginPage_alert"
				>
					<HighAlert
						title={highAlert!.title}
						description={highAlert!.description}
						status={highAlert?.status}
					/>
				</ScaleFade>
			)}
		</div>
	);
}
