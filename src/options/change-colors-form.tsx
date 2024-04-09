import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';

import IChangeColorsForm from './change-colors-form.interface';

import AccordionForm from '@/common/ui/forms/accordion-form';
import SortableFields from '@/common/ui/fields/sortable-fields';
import ColorField from '@/common/ui/fields/color-field';
import ApiServise from '@/common/services/api.service';
import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import IUpdateUserRo from '@/common/types/ro/users/update-user.interface';
import IUpdateUserDto from '@/common/types/dto/users/update-user.interface';
import { HTTPError } from '@/errors/http-error';
import IColor from '@/common/types/color.interface';
import httpErrHandler from '@/errors/http-err-handler.helper';

export interface IChangeColorsFormProps {
	currentColors: IColor[];
	onSuccess: (colors: IColor[]) => void;
}

export default function ChangeColorsForm({
	currentColors,
	onSuccess,
}: IChangeColorsFormProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<IChangeColorsForm>({
		values: {
			colors: currentColors,
		},
	});
	const { register, control, setError } = useFormReturnValue;
	const useFieldArrayReturn = useFieldArray({
		control,
		name: 'colors',
	});
	const { fields } = useFieldArrayReturn;

	async function onSubmit(formValues: IChangeColorsForm): Promise<boolean> {
		const newColors = formValues.colors.map(({ color }) => color);
		const resp = await new ApiServise().patch<IUpdateUserRo, IUpdateUserDto>(
			USERS_API_ROUTES.updateUser,
			{
				colors: newColors,
			}
		);
		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}
		toast({
			title: 'Colors has been successfully saved',
			status: 'success',
		});
		onSuccess(resp.colors);
		return true;
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof IChangeColorsForm, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({
					title: 'Failed to change colors',
					description: msg,
				});
			},
			onUnhandledErr() {
				toast({
					title: 'Failed to change colors',
					description: 'Something went wrong. Please try again',
				});
			},
		});
	}

	const accordionButtonText = (
		<div className="options_colors">
			{currentColors.map(({ color }, index) => (
				<div
					key={index}
					className="options_colorsItem"
					style={{
						backgroundColor: color,
					}}
				></div>
			))}
		</div>
	);

	return (
		<AccordionForm
			useFormReturnValue={useFormReturnValue}
			onSubmitHandler={onSubmit}
			accordionButtonText={accordionButtonText}
			tooltipLabel="Edit"
			labelText="Highlighter colors"
		>
			<SortableFields
				useFieldArrayReturn={useFieldArrayReturn}
				addBtn={{
					text: '+ Add color',
					value: {
						color: '#718096',
					},
				}}
				showDeleteBtn={true}
				fieldsList={fields.map((field, index) => (
					<ColorField
						key={field.id}
						register={register}
						name={`colors.${index}.color`}
						formControlCl="options_colorFormControl"
						inputCl="options_colorInput"
					/>
				))}
			/>
		</AccordionForm>
	);
}
