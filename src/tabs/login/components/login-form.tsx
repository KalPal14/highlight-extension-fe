import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Collapse } from '@chakra-ui/react';

import TLoginRo from '@/common/types/ro/users/login.type';
import ApiServise from '@/common/services/api.service';
import { HTTPError } from '@/errors/http-error/http-error';
import TextField from '@/common/ui/fields/text-field';
import OutsideClickAlert from '@/common/ui/alerts/outside-click-alert';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import httpErrHandler from '@/errors/http-error/http-err-handler';
import ILoginDto from '@/common/types/dto/users/login.interface';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import IBaseUserDto from '@/common/types/dto/users/base/base-user-info.interface';

export default function LoginForm(): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<TLoginRo>();

	const [, setJwt] = useCrossExtState<string | null>('jwt', null);
	const [, setCurrentUser] = useCrossExtState<IBaseUserDto | null>('currentUser', null);

	const [errAlerMsg, setErrAlertMsg] = useState<string | null>(null);

	async function onSubmit(formValues: TLoginRo): Promise<void> {
		const resp = await new ApiServise().post<TLoginRo, ILoginDto>(
			USERS_API_ROUTES.login,
			formValues
		);

		if (resp instanceof HTTPError) {
			handleErr(resp);
			return;
		}

		const { jwt, ...restUserInfo } = resp;
		setJwt(jwt);
		setCurrentUser(restUserInfo);
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof TLoginRo, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				setErrAlertMsg(msg);
				return;
			},
			onUnhandledErr() {
				setErrAlertMsg('Something went wrong. Please try again');
			},
		});
	}

	function closeErrAlert(): void {
		setErrAlertMsg(null);
	}

	return (
		<form
			className="loginPage_form"
			onSubmit={handleSubmit(onSubmit)}
		>
			<TextField
				register={register}
				errors={errors.userIdentifier}
				name="userIdentifier"
				label="Email or username"
				placeholder="Please enter email or usernamee"
			/>
			<TextField
				register={register}
				errors={errors.password}
				name="password"
				label="Password"
				placeholder="Please enter your password"
				type="password"
			/>
			<Collapse
				in={Boolean(errAlerMsg)}
				animateOpacity
			>
				<OutsideClickAlert
					msg={errAlerMsg ?? ''}
					onClose={closeErrAlert}
					mb={5}
				/>
			</Collapse>
			<Button
				mt={2}
				colorScheme="teal"
				isLoading={isSubmitting}
				type="submit"
			>
				Submit
			</Button>
		</form>
	);
}
