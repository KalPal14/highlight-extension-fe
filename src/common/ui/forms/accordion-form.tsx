import React from 'react';
import { ChevronUpIcon, EditIcon } from '@chakra-ui/icons';
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
			reset();
			setIsNeedToExpand.off();
		}
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
							label={!isExpanded && tooltipLabel}
							fontSize="md"
							placement="top-end"
						>
							<AccordionButton onClick={setIsNeedToExpand.toggle}>
								<Box
									as="span"
									flex="1"
									textAlign="left"
								>
									{accordionButtonText}
								</Box>
								{isExpanded ? <ChevronUpIcon /> : <EditIcon />}
							</AccordionButton>
						</Tooltip>
						<AccordionPanel pb={4}>
							<form onSubmit={handleSubmit(onSubmit)}>
								{children}
								<div className="accordionForm_formBtnsContainer">
									<Button
										onClick={() => {
											reset();
											setIsNeedToExpand.off();
										}}
										colorScheme="gray"
										variant="outline"
									>
										Cancel
									</Button>
									<Button
										ml={2}
										colorScheme="teal"
										isLoading={isSubmitting}
										type="submit"
									>
										Save
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
