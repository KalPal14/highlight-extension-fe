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
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import IChangePageUrlForm from '../types/change-page-url-form.interface';
import IDataForPageUpdating from '../types/data-for-page-updating.interface';

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
import getPageUrl from '@/common/helpers/get-page-url.helper';
import TGetPageRo from '@/common/types/ro/pages/get-page.type';
import TGetPageDto from '@/common/types/dto/pages/get-page.type';
import ConfirmationModal from '@/common/ui/modals/confirmation-modal';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import IUpdatedPagesUrlsExtState from '@/common/types/cross-ext-state/updated-pages-urls-ext-state.interface';

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

	const [, setUpdatedPages] = useCrossExtState<IUpdatedPagesUrlsExtState>('updatedPages', {
		urls: [],
	});

	const [dataForPageUpdating, setDataForPageUpdating] = useState<IDataForPageUpdating | null>();

	async function onSubmit(pageId: number, { url }: IChangePageUrlForm): Promise<boolean | void> {
		const pageWithNewUrl = await checkExistingPagesWithNewURL(url);

		if (pageWithNewUrl) {
			setDataForPageUpdating({ pageId, url });
			return;
		}

		return updatePage(pageId, url);
	}

	async function checkExistingPagesWithNewURL(url: string): Promise<boolean> {
		const pageWithNewUrl = await new ApiServise().get<TGetPageRo, TGetPageDto>(
			PAGES_API_ROUTES.getPage,
			{ url: getPageUrl(url) }
		);
		if (pageWithNewUrl instanceof HTTPError) {
			handleErr(pageWithNewUrl);
			return false;
		}
		if (!pageWithNewUrl.id) return false;
		if ((pageWithNewUrl.id = page.id)) return false;
		return true;
	}

	async function updatePage(pageId: number, url: string): Promise<boolean | void> {
		const resp = await new ApiServise().patch<TUpdatePageRo, IUpdatePageDto>(
			PAGES_API_ROUTES.update(pageId),
			{ url: getPageUrl(url) }
		);
		if (resp instanceof HTTPError) {
			handleErr(resp);
			return;
		}
		onUpdatePage(resp);
		setUpdatedPages((prev) => ({
			urls: [page.url, getPageUrl(url)],
			updateTrigger: !prev.updateTrigger,
		}));
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

	async function onConfirm(): Promise<void> {
		if (!dataForPageUpdating) return;
		const { pageId, url } = dataForPageUpdating;
		await updatePage(pageId, url);
		setDataForPageUpdating(null);
	}

	return (
		<>
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
									helperText="This field is intended for manual updating only if the address of the page with your highlights has been changed by the page owner"
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
			<ConfirmationModal
				isOpen={Boolean(dataForPageUpdating)}
				onConfirm={onConfirm}
				onCansel={() => setDataForPageUpdating(null)}
				header="Merge Confirmation"
				body="The page with this URL already exists. We can merge these pages together."
				confirmBtnText="Merge"
			/>
		</>
	);
}
