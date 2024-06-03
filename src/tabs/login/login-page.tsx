import React from 'react';
import { Link } from 'react-router-dom';
import { Text, Heading, ScaleFade } from '@chakra-ui/react';

import './login.scss';
import LoginForm from './components/login-form';

import { TABS_ROUTES } from '@/common/constants/routes/tabs';
import HighAlert from '@/common/ui/alerts/high-alert';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';

export default function LoginPage(): JSX.Element {
	const [jwt] = useCrossExtState<string | null>('jwt', null);

	return (
		<div className="loginPage">
			{!jwt && (
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
					<LoginForm />
				</section>
			)}
			{Boolean(jwt) && (
				<ScaleFade
					initialScale={0.9}
					in={Boolean(jwt)}
					className="loginPage_alert"
				>
					<HighAlert
						title="You have successfully logged in"
						description="You can close this tab. To log in to another account, log out of the current one"
						status="success"
					/>
				</ScaleFade>
			)}
		</div>
	);
}
