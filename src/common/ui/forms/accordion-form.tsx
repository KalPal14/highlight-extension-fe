import React from 'react';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
	Accordion,
	AccordionItem,
	Tooltip,
	AccordionButton,
	AccordionPanel,
	Button,
	Box,
	useBoolean,
	FormLabel,
} from '@chakra-ui/react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import './forms.scss';
import TJsxContent from '@/common/types/jsx-content.type';

export interface IAccordionFormProps<Form extends FieldValues> {
	children: JSX.Element;
	useFormReturnValue: UseFormReturn<Form>;
	onSubmitHandler: (formValue: Form) => Promise<boolean>;
	accordionButtonText: TJsxContent;
	tooltipLabel?: string;
	labelText?: string;
}

export default function AccordionForm<Form extends FieldValues>({
	children,
	useFormReturnValue,
	onSubmitHandler,
	accordionButtonText,
	tooltipLabel,
	labelText,
}: IAccordionFormProps<Form>): JSX.Element {
	const [isNeedToExpand, setIsNeedToExpand] = useBoolean(false);

	const {
		reset,
		handleSubmit,
		formState: { isSubmitting },
	} = useFormReturnValue;

	async function onSubmit(formValue: Form): Promise<void> {
		const isSuccess = await onSubmitHandler(formValue);
		if (isSuccess) {
			toggleAccordion();
		}
	}

	function toggleAccordion(): void {
		reset();
		setIsNeedToExpand.toggle();
	}

	return (
		<Accordion
			pb={5}
			className="accordionForm"
			index={isNeedToExpand ? 0 : -1}
		>
			<FormLabel
				mb={1}
				fontWeight={600}
			>
				{labelText}
			</FormLabel>
			<AccordionItem className="accordionForm_item">
				{({ isExpanded }) => (
					<>
						<Tooltip
							label={tooltipLabel}
							fontSize="md"
							placement="top-end"
						>
							<AccordionButton onClick={toggleAccordion}>
								<Box
									as="span"
									flex="1"
									textAlign="left"
								>
									{accordionButtonText}
								</Box>
								{isExpanded ? <CloseIcon /> : <EditIcon />}
							</AccordionButton>
						</Tooltip>
						<AccordionPanel pb={4}>
							<form onSubmit={handleSubmit(onSubmit)}>
								{children}
								<div className="accordionForm_formBtnsContainer">
									<Button
										onClick={toggleAccordion}
										colorScheme="red"
									>
										Cancel
									</Button>
									<Button
										ml={2}
										colorScheme="teal"
										isLoading={isSubmitting}
										type="submit"
									>
										Submit
									</Button>
								</div>
							</form>
						</AccordionPanel>
					</>
				)}
			</AccordionItem>
		</Accordion>
	);
}
