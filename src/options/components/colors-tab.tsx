import React from 'react';

import ChangeColorsForm from './change-colors-form';

import { DEF_COLORS } from '@/common/constants/default-values/colors';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import IBaseUserDto from '@/common/types/dto/users/base/base-user-info.interface';

export default function ColorsTab(): JSX.Element {
	const [currentUser, setCurrentUser] = useCrossExtState<IBaseUserDto | null>('currentUser', null);

	return (
		<section className="options_colorsTab">
			{currentUser && (
				<ChangeColorsForm
					currentColors={currentUser.colors.length ? currentUser.colors : DEF_COLORS}
					onSuccess={(colors) =>
						setCurrentUser({
							...currentUser,
							colors,
						})
					}
				/>
			)}
		</section>
	);
}
