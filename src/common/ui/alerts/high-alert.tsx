import React from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react';
import cl from 'classnames';

import './alerts.scss';

import TJsxContent from '@/common/types/jsx-content.type';

export interface IHighAlertProps {
	title: TJsxContent;
	description: TJsxContent;
	status?: 'success' | 'info' | 'warning' | 'error' | 'loading';
	className?: string;
}

export default function HighAlert({
	title,
	description,
	status = 'success',
	className,
}: IHighAlertProps): JSX.Element {
	return (
		<Alert
			status={status}
			variant="subtle"
			className={cl('subtleAlert', className)}
		>
			<AlertIcon
				boxSize="40px"
				mr={0}
			/>
			<AlertTitle
				mt={4}
				mb={1}
				fontSize="lg"
			>
				{title}
			</AlertTitle>
			<AlertDescription maxWidth="sm">{description}</AlertDescription>
		</Alert>
	);
}
