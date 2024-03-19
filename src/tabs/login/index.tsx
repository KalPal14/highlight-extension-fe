import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FormErrorMessage, FormLabel, FormControl, Input, Button } from '@chakra-ui/react';
import cl from 'classnames';

import './login.scss';
import { tabsRoutes } from '@/common/constants/routes/tabs';
import ApiServise from '@/common/services/api.service';
import { HTTPError } from '@/errors/http-error';

export default function LoginPage(): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<{ name: string }>();

	const [name, setName] = useState<string | null>(null);

	async function onSubmit(values: { name: string }): Promise<void> {
		setName(values.name);
		const resp = await new ApiServise().post('https://localhost:8000/users/login');
		if (resp instanceof HTTPError) {
			console.log(resp.payload);
		} else {
			console.log(resp);
		}
	}

	return (
		<div className={cl('p-5')}>
			<h1>{name ? `Hello ${name}` : 'Login'}</h1>
			<Link
				className="mt-2 mb-2"
				to={tabsRoutes.registration}
			>
				Registration
			</Link>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormControl isInvalid={Boolean(errors?.name)}>
					<FormLabel htmlFor="name">First name</FormLabel>
					<Input
						id="name"
						placeholder="name"
						size="sm"
						{...register('name', {
							required: 'This is required',
							minLength: { value: 4, message: 'Minimum length should be 4' },
						})}
					/>
					<FormErrorMessage>{(errors.name && errors.name.message) as ReactNode}</FormErrorMessage>
				</FormControl>
				<Button
					mt={4}
					size="sm"
					colorScheme="teal"
					isLoading={isSubmitting}
					type="submit"
				>
					Submit
				</Button>
			</form>
		</div>
	);
}
