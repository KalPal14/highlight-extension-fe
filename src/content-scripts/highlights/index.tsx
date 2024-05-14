import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactShadowRoot from 'react-shadow-root';

import Highlights from './highlights';

window.onload = (): void => init();

function init(): void {
	const highlightsMarker = document.createElement('highlights-ext-container');
	highlightsMarker.id = 'highlights-ext-container';
	document.body.append(highlightsMarker);

	createRoot(highlightsMarker).render(
		<ReactShadowRoot>
			<Highlights />
		</ReactShadowRoot>
	);
}
