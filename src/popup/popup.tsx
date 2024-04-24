import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

import './popup.scss';

import LoginSection from './login-section';

import goTo from '@/common/helpers/go-to.helper';
import { ROOT_OPTIONS_ROUTE } from '@/common/constants/routes/options';

export default function Popup(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		loginCheck();
	}, []);

	async function loginCheck(): Promise<void> {
		const { token } = await chrome.storage.local.get('token');
		setIsLoggedIn(Boolean(token));
	}

	async function logout(): Promise<void> {
		await chrome.storage.local.set({
			token: null,
		});
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
