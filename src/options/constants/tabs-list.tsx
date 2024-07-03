import React from 'react';

import ColorsTab from '../components/colors-tab';
import PagesTab from '../components/pages-tab';
import UserInfoTab from '../components/user-info-tab';

const tabsList = [
	{
		searchParam: 'user-info',
		name: 'User info',
		element: <UserInfoTab />,
	},
	{
		searchParam: 'colors',
		name: 'Colors',
		element: <ColorsTab />,
	},
	{
		searchParam: 'pages',
		name: 'Pages',
		element: <PagesTab />,
	},
];
export default tabsList;
