export const PAGES_API_ROUTES = {
	getPage: '/pages/page',
	getPages: '/pages/get-all',
	update: (id: number): string => `/pages/page/${id}`,
};
