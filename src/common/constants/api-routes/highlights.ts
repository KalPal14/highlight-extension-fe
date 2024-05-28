export const HIGHLIGHTS_API_ROUTES = {
	getHighlghts: '/highlights',
	create: '/highlights/highlight',
	update: (id: number): string => `/highlights/highlight/${id}`,
	delete: (id: number): string => `/highlights/highlight/${id}`,
};
