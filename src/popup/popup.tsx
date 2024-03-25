import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';

import './popup.scss';

import LoginSection from './login-section';

import { getCookie } from '@/common/services/cookies.service';
import ApiServise from '@/common/services/api.service';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import { HTTPError } from '@/errors/http-error';

export default function Popup(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		loginCheck();
	}, []);

	async function loginCheck(): Promise<void> {
		const jwtToken = await getCookie('token');
		setIsLoggedIn(Boolean(jwtToken));
	}

	async function logout(): Promise<void> {
		const resp = await new ApiServise().post(USERS_API_ROUTES.logout);
		if (resp instanceof HTTPError) return;
		setIsLoggedIn(false);
	}

	return (
		<div className="popup">
			{!isLoggedIn && <LoginSection />}
			{isLoggedIn && (
				<section className="popup_logout">
					<Button
						onClick={logout}
						colorScheme="teal"
						w="100%"
					>
						Log out
					</Button>
				</section>
			)}
		</div>
	);
}
