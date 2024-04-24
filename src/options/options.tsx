import React, { useEffect, useState } from 'react';
import { Alert, AlertIcon, Heading, Text } from '@chakra-ui/react';

import './options.scss';

import ChangeEmailForm from './change-email-form';
import ChangeUsernameForm from './change-username-form';
import ChangePasswordForm from './change-password-form';
import ChangeColorsForm from './change-colors-form';

import ApiServise from '@/common/services/api.service';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import IGetUserInfoDto from '@/common/types/dto/users//get-user-info.interface';
import { HTTPError } from '@/errors/http-error';
import { DEF_COLORS } from '@/common/constants/colors';

const OptionsPage = (): JSX.Element => {
	const [userInfo, setUserInfo] = useState<IGetUserInfoDto | null>(null);

	useEffect(() => {
		chrome.storage.onChanged.addListener(getUserInfo);
		getUserInfo();

		return () => chrome.storage.onChanged.removeListener(getUserInfo);
	}, []);

	async function getUserInfo(): Promise<void> {
		const resp = await new ApiServise().get<null, IGetUserInfoDto>(USERS_API_ROUTES.getUserInfo);
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
						Sorry. We were unable to load your information. Make sure you are logged in.
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
						<ChangeColorsForm
							currentColors={userInfo.colors.length ? userInfo.colors : DEF_COLORS}
							onSuccess={(colors) =>
								setUserInfo({
									...userInfo,
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
