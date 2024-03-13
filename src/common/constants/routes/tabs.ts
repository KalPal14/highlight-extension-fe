export const rootTabsRoute = 'tabs.html';

export const tabsRoutes = {
	login: '/login',
	registration: '/registration',
	pages: '/pages',
};

export const fullTabsRoutes = {
	login: `${rootTabsRoute}#${tabsRoutes.login}`,
	registration: `${rootTabsRoute}#${tabsRoutes.registration}`,
	pages: `${rootTabsRoute}#${tabsRoutes.pages}`,
};
