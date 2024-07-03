import React from 'react';

import ChangeEmailForm from './change-email-form';
import ChangePasswordForm from './change-password-form';
import ChangeUsernameForm from './change-username-form';

import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import IBaseUserDto from '@/common/types/dto/users/base/base-user-info.interface';

export default function UserInfoTab(): JSX.Element {
	const [currentUser, setCurrentUser] = useCrossExtState<IBaseUserDto | null>('currentUser', null);

	return (
		<section className="options_userInfoTab">
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
				</>
			)}
		</section>
	);
}
