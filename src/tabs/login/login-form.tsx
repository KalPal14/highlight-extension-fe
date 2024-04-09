import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';

import './login.scss';

import ILoginForm from './login-form.interface';

import ApiServise from '@/common/services/api.service';
import { HTTPError } from '@/errors/http-error';
import TextField from '@/common/ui/fields/text-field';
import OutsideClickAlert from '@/common/ui/alerts/outside-click-alert';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import httpErrHandler from '@/errors/http-err-handler.helper';

export interface ILoginFormProps {
	onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: ILoginFormProps): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<ILoginForm>();

	const [errAlerMsg, setErrAlertMsg] = useState<string | null>(null);

	async function onSubmit(formValues: ILoginForm): Promise<void> {
		const resp = await new ApiServise().post(USERS_API_ROUTES.login, formValues);
		if (resp instanceof HTTPError) {
			handleErr(resp);
			return;
		}
		onSuccess();
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof ILoginForm, {
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
			{errAlerMsg && (
				<OutsideClickAlert
					msg={errAlerMsg}
					onClose={closeErrAlert}
					mb={5}
				/>
			)}
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
