export const HIGHLIGHTS_API_ROUTES = {
	create: '/highlights/highlight',
	update: (id: number): string => `/highlights/highlight/${id}`,
	delete: (id: number): string => `/highlights/highlight/${id}`,
};
