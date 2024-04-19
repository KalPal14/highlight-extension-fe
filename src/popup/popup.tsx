import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

import './popup.scss';

import LoginSection from './login-section';

import ApiServise from '@/common/services/api.service';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import { HTTPError } from '@/errors/http-error';
import goTo from '@/common/helpers/go-to.helper';
import { ROOT_OPTIONS_ROUTE } from '@/common/constants/routes/options';

export default function Popup(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		loginCheck();
	}, []);

	function loginCheck(): void {
		const jwtToken = localStorage.getItem('token');
		setIsLoggedIn(Boolean(jwtToken));
	}

	async function logout(): Promise<void> {
		const resp = await new ApiServise().post(USERS_API_ROUTES.logout);
		if (resp instanceof HTTPError) return;
		setIsLoggedIn(false);
	}

	return (
		<div className="popup">
			<header className="popup_header">
				<Tooltip
					label="Settings"
					fontSize="md"
					placement="auto-end"
				>
					<SettingsIcon
						onClick={() => goTo(ROOT_OPTIONS_ROUTE)}
						height={7}
						width={7}
						color="gray.400"
						cursor="pointer"
					/>
				</Tooltip>
			</header>
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
