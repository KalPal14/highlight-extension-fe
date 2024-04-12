import React from 'react';
import { createRoot } from 'react-dom/client';

import Highlights from './highlights';

window.onload = (): void => init();

function init(): void {
	const rootContainer = document.createElement('div');
	rootContainer.classList.add('highlights_rootContainer');
	document.body.prepend(rootContainer);
	const root = createRoot(rootContainer);
	root.render(<Highlights />);
}
