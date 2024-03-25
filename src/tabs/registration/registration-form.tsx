import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';

import './registration.scss';

import IRegistrationForm from './registration-form.interface';

import ApiServise from '@/common/services/api.service';
import { HTTPError } from '@/errors/http-error';
import TextField from '@/common/ui/fields/text-field';
import OutsideClickAlert from '@/common/ui/alerts/outside-click-alert';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';

export interface IRegistrationFormProps {
	onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: IRegistrationFormProps): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<IRegistrationForm>();

	const [errAlerMsg, setErrAlertMsg] = useState<string | null>(null);

	async function onSubmit(formValues: IRegistrationForm): Promise<void> {
		const resp = await new ApiServise().post(USERS_API_ROUTES.register, formValues);
		if (resp instanceof HTTPError) {
			handleFormRespErrors(resp);
			return;
		}
		onSuccess();
	}

	function handleFormRespErrors(resp: HTTPError): void {
		if (Array.isArray(resp.payload)) {
			resp.payload.forEach(({ property, errors }) =>
				setError(property as keyof IRegistrationForm, {
					message: errors.join(),
				})
			);
			return;
		}
		if (typeof resp.payload !== 'string') {
			setErrAlertMsg(resp.payload.err);
			return;
		}
		setErrAlertMsg('Something went wrong. Please try again');
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
				errors={errors.email}
				name="email"
				label="Email"
				placeholder="Please enter email"
			/>
			<TextField
				register={register}
				errors={errors.username}
				name="username"
				label="Username"
				placeholder="Please enter username"
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
