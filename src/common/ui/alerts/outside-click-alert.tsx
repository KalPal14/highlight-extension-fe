import React, { useRef } from 'react';
import { useOutsideClick, Alert, AlertIcon } from '@chakra-ui/react';

export interface IOutsideClickAlertProps {
	msg: string;
	onClose: () => void;
	status?: 'error' | 'info' | 'warning' | 'success' | 'loading';
	mb?: string | number;
}

export default function OutsideClickAlert({
	msg,
	onClose,
	status = 'error',
	mb,
}: IOutsideClickAlertProps): JSX.Element {
	const ref = useRef(null);

	useOutsideClick({
		ref: ref,
		handler: () => onClose(),
	});

	return (
		<Alert
			ref={ref}
			status={status}
			mb={mb}
		>
			<AlertIcon />
			{msg}
		</Alert>
	);
}
