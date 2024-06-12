import React from 'react';
import { Heading } from '@chakra-ui/react';

export default function Sidepanel(): JSX.Element {
	const pageUrl = new URL(window.location.href).searchParams.get('url');

	return <Heading>Sidepanel on {pageUrl}</Heading>;
}
