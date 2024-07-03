import {
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	Button,
	Box,
	Text,
	useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import IChangePageUrlForm from '../types/change-page-url-form.interface';

import AccordionForm from '@/common/ui/forms/accordion-form';
import TextField from '@/common/ui/fields/text-field';
import TArrayElement from '@/common/types/array-element.type';
import TGetPagesDto from '@/common/types/dto/pages/get-pages.type';
import ApiServise from '@/common/services/api.service';
import { PAGES_API_ROUTES } from '@/common/constants/api-routes/pages';
import IUpdatePageDto from '@/common/types/dto/pages/update-page.interface';
import TUpdatePageRo from '@/common/types/ro/pages/update-page.type';
import { HTTPError } from '@/errors/http-error/http-error';
import httpErrHandler from '@/errors/http-error/http-err-handler';

export interface IPageItemProps {
	page: TArrayElement<TGetPagesDto>;
	onUpdatePage: (page: IUpdatePageDto) => void;
}

export default function PageItem({ page, onUpdatePage }: IPageItemProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<IChangePageUrlForm>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	async function onSubmit(pageId: number, { url }: IChangePageUrlForm): Promise<boolean> {
		const resp = await new ApiServise().patch<TUpdatePageRo, IUpdatePageDto>(
			PAGES_API_ROUTES.update(pageId),
			{ url }
		);
		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}
		onUpdatePage(resp);
		toast({
			title: 'Page url has been successfully changed',
			status: 'success',
		});
		return true;
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof IChangePageUrlForm, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({
					title: 'Failed to update page url',
					description: msg,
				});
			},
			onUnhandledErr() {
				toast({
					title: 'Failed to update page url',
					description: 'Something went wrong. Please try again',
				});
			},
		});
	}

	return (
		<AccordionItem key={page.id}>
			<h2>
				<AccordionButton>
					<Box
						as="span"
						flex="1"
						textAlign="left"
					>
						{page.url}
					</Box>
					<AccordionIcon />
				</AccordionButton>
			</h2>
			<AccordionPanel pb={4}>
				<div>
					<AccordionForm
						useFormReturnValue={useFormReturnValue}
						onSubmitHandler={async (formValues) => {
							return await onSubmit(page.id, formValues);
						}}
						accordionButtonText={page.url}
						labelText="Update page url"
					>
						<>
							<TextField
								register={register}
								errors={errors.url}
								name="url"
								placeholder="Please enter a new page url"
							/>
						</>
					</AccordionForm>
				</div>
				<Text fontSize="1rem">
					<span className="options_text-highlighted">{page.highlightsCount}</span> highlights
				</Text>
				<Text fontSize="1rem">
					<span className="options_text-highlighted">{page.notesCount}</span> notes
				</Text>
				<Button
					onClick={() => window.open(page.url)}
					colorScheme="teal"
					mt={5}
				>
					Go to page
				</Button>
			</AccordionPanel>
		</AccordionItem>
	);
}
