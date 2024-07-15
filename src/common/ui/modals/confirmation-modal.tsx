import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from '@chakra-ui/react';
import React from 'react';

import './modals.scss';

export interface IConfirmationModalProps {
	isOpen: boolean;
	header?: string;
	body?: JSX.Element | string;
	confirmBtnText?: string;
	onCansel: () => void;
	onConfirm: () => void;
}

export default function ConfirmationModal({
	isOpen,
	header,
	body,
	confirmBtnText,
	onCansel,
	onConfirm,
}: IConfirmationModalProps): JSX.Element {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onCansel}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{header ? header : 'Confirmation'}</ModalHeader>
				<ModalBody className="confirmationModal_body">{body}</ModalBody>

				<ModalFooter>
					<Button
						onClick={onCansel}
						colorScheme="gray"
						variant="outline"
						mr={3}
					>
						Cancel
					</Button>
					<Button
						onClick={onConfirm}
						colorScheme="teal"
					>
						{confirmBtnText ? confirmBtnText : 'Сonfirm'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
