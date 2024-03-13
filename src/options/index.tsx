import React from 'react';
import { createRoot } from 'react-dom/client';

import OptionsPage from './options';

function init(): void {
	const rootContainer = document.createElement('div');
	document.body.appendChild(rootContainer);
	const root = createRoot(rootContainer);
	root.render(<OptionsPage />);
}

init();
