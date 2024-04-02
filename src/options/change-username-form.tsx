import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import IChangeUsernameForm from './change-username-form.interface';

import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import ApiServise from '@/common/services/api.service';
import TextField from '@/common/ui/fields/text-field';
import AccordionForm from '@/common/ui/forms/accordion-form';
import { HTTPError } from '@/errors/http-error';
import IChangeUsernameDto from '@/common/types/dto/users/change-username.interface';

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
	const useFormReturnValue = useForm<IChangeUsernameForm>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	async function onSubmit(formValues: IChangeUsernameForm): Promise<boolean> {
		const resp = await new ApiServise().patch<IChangeUsernameForm, IChangeUsernameDto>(
			USERS_API_ROUTES.changeUsername,
			formValues
		);
		if (resp instanceof HTTPError) {
			handleFormRespErrors(resp);
			return false;
		}
		onSuccess(resp.username);
		toast({
			title: 'Username has been successfully changed',
			status: 'success',
		});
		return true;
	}

	function handleFormRespErrors(resp: HTTPError): void {
		if (Array.isArray(resp.payload)) {
			resp.payload.forEach(({ property, errors }) =>
				setError(property as keyof IChangeUsernameForm, {
					message: errors.join(),
				})
			);
			return;
		}
		if (typeof resp.payload !== 'string') {
			toast({
				title: 'Failed to change username',
				description: resp.payload.err,
			});
			return;
		}
		toast({
			title: 'Failed to change username',
			description: 'Something went wrong. Please try again',
		});
	}
	return (
		<AccordionForm
			useFormReturnValue={useFormReturnValue}
			onSubmitHandler={onSubmit}
			accordionButtonText={currentUsername}
			tooltipLabel="edit"
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
