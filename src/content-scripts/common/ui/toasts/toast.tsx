import React from 'react';
import cl from 'classnames';
import { CheckCircleIcon, WarningIcon, InfoIcon, IconProps } from '@chakra-ui/icons';
import { ComponentWithAs } from '@chakra-ui/react';

export interface IToastProps {
	status?: 'success' | 'error' | 'warning' | 'info';
	title?: JSX.Element | string;
	description?: JSX.Element | string;
}

export default function Toast({ status = 'error', title, description }: IToastProps): JSX.Element {
	function getIcon(): ComponentWithAs<'svg', IconProps> {
		switch (status) {
			case 'success':
				return CheckCircleIcon;
			case 'info':
				return InfoIcon;
			default:
				return WarningIcon;
		}
	}
	const Icon = getIcon();

	return (
		<article
			className={cl('csToast', {
				'csToast-success': status === 'success',
				'csToast-error': status === 'error',
				'csToast-warning': status === 'warning',
				'csToast-info': status === 'info',
			})}
		>
			<Icon className="csToast_svgImg" />
			<p>
				{title ? <h6>{title}</h6> : <span>{description}</span>}
				{title && <span>{description}</span>}
			</p>
		</article>
	);
}
