import React, { useEffect, useState } from 'react';
import { Alert, AlertIcon, Heading, Text } from '@chakra-ui/react';

import './options.scss';

import ChangeEmailForm from './change-email-form';
import ChangeUsernameForm from './change-username-form';
import ChangePasswordForm from './change-password-form';

import ApiServise from '@/common/services/api.service';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import IUserInfoDto from '@/common/types/dto/users/user-info.interface';
import { HTTPError } from '@/errors/http-error';

const OptionsPage = (): JSX.Element => {
	const [userInfo, setUserInfo] = useState<IUserInfoDto | null>(null);

	useEffect(() => {
		getUserInfo();
	}, []);

	async function getUserInfo(): Promise<void> {
		const resp = await new ApiServise().get<null, IUserInfoDto>(USERS_API_ROUTES.getUserInfo);
		if (resp instanceof HTTPError) return;
		setUserInfo(resp);
	}

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
				{!userInfo && (
					<Alert
						status="warning"
						mt={3}
					>
						<AlertIcon />
						Sorry. We were unable to load your information. Make sure you are logged in and refresh
						the page.
					</Alert>
				)}
				{userInfo && (
					<>
						<ChangeEmailForm
							currentEmail={userInfo.email}
							onSuccess={(email) =>
								setUserInfo({
									...userInfo,
									email,
								})
							}
						/>
						<ChangeUsernameForm
							currentUsername={userInfo.username}
							onSuccess={(username) =>
								setUserInfo({
									...userInfo,
									username,
								})
							}
						/>
						<ChangePasswordForm
							passwordUpdatedAt={userInfo.passwordUpdatedAt}
							onSuccess={(passwordUpdatedAt) =>
								setUserInfo({
									...userInfo,
									passwordUpdatedAt,
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
