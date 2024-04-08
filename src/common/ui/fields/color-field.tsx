import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

export interface ITextFieldProps<FormFields extends FieldValues> {
	register: UseFormRegister<FormFields>;
	name: Path<FormFields>;
	label?: string;
	formControlCl?: string;
	inputCl?: string;
}

export default function ColorField<FormFields extends FieldValues>({
	register,
	name,
	label,
	formControlCl,
	inputCl,
}: ITextFieldProps<FormFields>): JSX.Element {
	return (
		<FormControl className={formControlCl}>
			{label && (
				<FormLabel
					htmlFor={name}
					mb={1}
					fontWeight={600}
				>
					{label}
				</FormLabel>
			)}
			<Input
				id={name}
				{...register(name, {})}
				type="color"
				className={inputCl}
				border="none"
				p={0}
			></Input>
		</FormControl>
	);
}
