import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import date from 'date-and-time';

import IChangePasswordForm from './change-password-form.interface';

import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import ApiServise from '@/common/services/api.service';
import TextField from '@/common/ui/fields/text-field';
import AccordionForm from '@/common/ui/forms/accordion-form';
import { HTTPError } from '@/errors/http-error';
import IChangePasswordDto from '@/common/types/dto/change-password.interface';

export interface IChangePasswordFormProps {
	passwordUpdatedAt: string | null;
	onSuccess: (passwordUpdatedAt: string) => void;
}

export default function ChangePasswordForm({
	passwordUpdatedAt,
	onSuccess,
}: IChangePasswordFormProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<IChangePasswordForm>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	async function onSubmit(formValues: IChangePasswordForm): Promise<boolean> {
		const resp = await new ApiServise().patch<IChangePasswordForm, IChangePasswordDto>(
			USERS_API_ROUTES.changePassword,
			formValues
		);
		if (resp instanceof HTTPError) {
			handleFormRespErrors(resp);
			return false;
		}
		onSuccess(resp.passwordUpdatedAt);
		toast({
			title: 'Password has been successfully changed',
			status: 'success',
		});
		return true;
	}

	function handleFormRespErrors(resp: HTTPError): void {
		if (Array.isArray(resp.payload)) {
			resp.payload.forEach(({ property, errors }) =>
				setError(property as keyof IChangePasswordForm, {
					message: errors.join(),
				})
			);
			return;
		}
		if (typeof resp.payload !== 'string') {
			toast({
				title: 'Failed to change password',
				description: resp.payload.err,
			});
			return;
		}
		toast({
			title: 'Failed to change password',
			description: 'Something went wrong. Please try again',
		});
	}

	const accordionButtonText = passwordUpdatedAt
		? `Last update: ${date.format(new Date(passwordUpdatedAt), 'YYYY/MM/DD HH:mm')}`
		: 'Never updated';

	return (
		<AccordionForm
			useFormReturnValue={useFormReturnValue}
			onSubmitHandler={onSubmit}
			accordionButtonText={accordionButtonText}
			tooltipLabel="edit"
			labelText="Password"
		>
			<>
				<TextField
					register={register}
					errors={errors.password}
					name="password"
					label="Current password"
					placeholder="Please enter your current password"
					type="password"
				/>
				<TextField
					register={register}
					errors={errors.newPassword}
					name="newPassword"
					label="New password"
					placeholder="Please enter a new password"
					type="password"
				/>
			</>
		</AccordionForm>
	);
}
