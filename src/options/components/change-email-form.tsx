import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import TChangeEmailRo from '@/common/types/ro/users/change-email.type';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import ApiServise from '@/common/services/api.service';
import IChangeEmailDto from '@/common/types/dto/users/change-email.interface';
import TextField from '@/common/ui/fields/text-field';
import AccordionForm from '@/common/ui/forms/accordion-form';
import { HTTPError } from '@/errors/http-error/http-error';
import httpErrHandler from '@/errors/http-error/http-err-handler';

export interface IChangeEmailFormProps {
	currentEmail: string;
	onSuccess: (email: string) => void;
}

export default function ChangeEmailForm({
	currentEmail,
	onSuccess,
}: IChangeEmailFormProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<TChangeEmailRo>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	async function onSubmit(formValues: TChangeEmailRo): Promise<boolean> {
		const resp = await new ApiServise().patch<TChangeEmailRo, IChangeEmailDto>(
			USERS_API_ROUTES.changeEmail,
			formValues
		);

		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}

		await chrome.storage.local.set({
			token: resp.jwt,
		});
		onSuccess(resp.email);
		toast({
			title: 'Email has been successfully changed',
			status: 'success',
		});
		return true;
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof TChangeEmailRo, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({
					title: 'Failed to change email',
					description: msg,
				});
			},
			onUnhandledErr() {
				toast({
					title: 'Failed to change email',
					description: 'Something went wrong. Please try again',
				});
			},
		});
	}

	return (
		<AccordionForm
			useFormReturnValue={useFormReturnValue}
			onSubmitHandler={onSubmit}
			accordionButtonText={currentEmail}
			tooltipLabel="Edit"
			labelText="Email"
		>
			<>
				<TextField
					register={register}
					errors={errors.newEmail}
					name="newEmail"
					label="New email"
					placeholder="Please enter your new email"
				/>
			</>
		</AccordionForm>
	);
}
