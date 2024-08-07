import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import TChangeUsernameRo from '@/common/types/ro/users/change-username.type';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import ApiServise from '@/common/services/api.service';
import TextField from '@/common/ui/fields/text-field';
import AccordionForm from '@/common/ui/forms/accordion-form';
import { HTTPError } from '@/errors/http-error/http-error';
import IChangeUsernameDto from '@/common/types/dto/users/change-username.interface';
import httpErrHandler from '@/errors/http-error/http-err-handler';

export interface IChangeusernameFormProps {
	currentUsername: string;
	onSuccess: (username: string) => void;
}

export default function ChangeUsernameForm({
	currentUsername,
	onSuccess,
}: IChangeusernameFormProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<TChangeUsernameRo>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	async function onSubmit(formValues: TChangeUsernameRo): Promise<boolean> {
		const resp = await new ApiServise().patch<TChangeUsernameRo, IChangeUsernameDto>(
			USERS_API_ROUTES.changeUsername,
			formValues
		);

		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}

		await chrome.storage.local.set({
			token: resp.jwt,
		});
		onSuccess(resp.username);
		toast({
			title: 'Username has been successfully changed',
			status: 'success',
		});
		return true;
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof TChangeUsernameRo, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({
					title: 'Failed to change username',
					description: msg,
				});
			},
			onUnhandledErr() {
				toast({
					title: 'Failed to change username',
					description: 'Something went wrong. Please try again',
				});
			},
		});
	}

	return (
		<AccordionForm
			useFormReturnValue={useFormReturnValue}
			onSubmitHandler={onSubmit}
			accordionButtonText={currentUsername}
			tooltipLabel="Edit"
			labelText="Username"
		>
			<>
				<TextField
					register={register}
					errors={errors.newUsername}
					name="newUsername"
					label="New username"
					placeholder="Please enter your new username"
				/>
			</>
		</AccordionForm>
	);
}
