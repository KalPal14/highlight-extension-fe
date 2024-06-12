import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import Sidepanel from './sidepanel';

function init(): void {
	const rootContainer = document.createElement('div');
	document.body.appendChild(rootContainer);
	const root = createRoot(rootContainer);
	root.render(
		<ChakraProvider>
			<Sidepanel />
		</ChakraProvider>
	);
}

init();
