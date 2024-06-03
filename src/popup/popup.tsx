import React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

import './popup.scss';

import LoginSection from './components/login-section';

import openTab from '@/common/helpers/open-tab.helper';
import { ROOT_OPTIONS_ROUTE } from '@/common/constants/routes/options';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';

export default function Popup(): JSX.Element {
	const [jwt, setJwt] = useCrossExtState<string | null>('jwt', null);

	async function logout(): Promise<void> {
		setJwt(null);
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
						onClick={() => openTab(ROOT_OPTIONS_ROUTE)}
						height={7}
						width={7}
						color="gray.400"
						cursor="pointer"
					/>
				</Tooltip>
			</header>
			{!jwt && <LoginSection />}
			{jwt && (
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
