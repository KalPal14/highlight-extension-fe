export const ROOT_TABS_ROUTTE = 'tabs.html';

export const TABS_ROUTES = {
	login: '/login',
	registration: '/registration',
	pages: '/pages',
};

export const FULL_TABS_ROUTES = {
	login: `${ROOT_TABS_ROUTTE}#${TABS_ROUTES.login}`,
	registration: `${ROOT_TABS_ROUTTE}#${TABS_ROUTES.registration}`,
	pages: `${ROOT_TABS_ROUTTE}#${TABS_ROUTES.pages}`,
};
