import React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

import './popup.scss';

import LoginSection from './components/login-section';

import openTab from '@/common/helpers/open-tab.helper';
import { FULL_OPTIONS_ROUTES } from '@/common/constants/routes/options';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import IBaseUserDto from '@/common/types/dto/users/base/base-user-info.interface';

export default function Popup(): JSX.Element {
	const [jwt, setJwt] = useCrossExtState<string | null>('jwt', null);
	const [, setCurrentUser] = useCrossExtState<IBaseUserDto | null>('currentUser', null);
	const [isExtActive, setIsExtActive] = useCrossExtState<boolean>('isExtActive', true);

	async function logout(): Promise<void> {
		setJwt(null);
		setCurrentUser(null);
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
						onClick={() => openTab(FULL_OPTIONS_ROUTES.userInfo)}
						height={7}
						width={7}
						color="gray.400"
						cursor="pointer"
					/>
				</Tooltip>
			</header>
			<Button
				onClick={() => setIsExtActive((prev) => !prev)}
				colorScheme={isExtActive ? 'red' : 'teal'}
				className="popup_extButton"
			>
				{isExtActive ? 'Disable' : 'Enable'} extension
			</Button>
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
