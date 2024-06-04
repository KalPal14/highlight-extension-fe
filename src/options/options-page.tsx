import React from 'react';
import { Alert, AlertIcon, Heading, Text } from '@chakra-ui/react';

import './options.scss';

import ChangeEmailForm from './components/change-email-form';
import ChangeUsernameForm from './components/change-username-form';
import ChangePasswordForm from './components/change-password-form';
import ChangeColorsForm from './components/change-colors-form';

import { DEF_COLORS } from '@/common/constants/default-values/colors';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import IBaseUserDto from '@/common/types/dto/users/base/base-user-info.interface';

const OptionsPage = (): JSX.Element => {
	const [currentUser, setCurrentUser] = useCrossExtState<IBaseUserDto | null>('currentUser', null);

	return (
		<div className="options">
			<Heading
				as="h1"
				size="2xl"
				mb={5}
			>
				Settings
			</Heading>
			<section className="options_userInfoSection">
				<Heading
					as="h2"
					size="xl"
					mb={4}
				>
					User info
				</Heading>
				{!currentUser && (
					<Alert
						status="warning"
						mt={3}
					>
						<AlertIcon />
						Sorry. We were unable to load your information. Make sure you are logged in.
					</Alert>
				)}
				{currentUser && (
					<>
						<ChangeEmailForm
							currentEmail={currentUser.email}
							onSuccess={(email) =>
								setCurrentUser({
									...currentUser,
									email,
								})
							}
						/>
						<ChangeUsernameForm
							currentUsername={currentUser.username}
							onSuccess={(username) =>
								setCurrentUser({
									...currentUser,
									username,
								})
							}
						/>
						<ChangePasswordForm
							passwordUpdatedAt={currentUser.passwordUpdatedAt}
							onSuccess={(passwordUpdatedAt) =>
								setCurrentUser({
									...currentUser,
									passwordUpdatedAt,
								})
							}
						/>
						<ChangeColorsForm
							currentColors={currentUser.colors.length ? currentUser.colors : DEF_COLORS}
							onSuccess={(colors) =>
								setCurrentUser({
									...currentUser,
									colors,
								})
							}
						/>
					</>
				)}
			</section>
			<section className="options_pagesInfoSection">
				<Heading
					as="h2"
					size="xl"
					mt={4}
				>
					Pages info
				</Heading>
				<Text>Pages bla bla</Text>
			</section>
		</div>
	);
};

export default OptionsPage;
