import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactShadowRoot from 'react-shadow-root';

import styles from './highlights.shadow-dom.scss';
import Highlights from './highlights';

window.onload = (): void => init();

function init(): void {
	const highlightsMarker = document.createElement('highlights-ext-container');
	highlightsMarker.id = 'highlights-ext-container';
	document.body.append(highlightsMarker);

	createRoot(highlightsMarker).render(
		<ReactShadowRoot>
			<style>{String(styles)}</style>
			<Highlights />
		</ReactShadowRoot>
	);
}
