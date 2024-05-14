import React from 'react';
import { Button, Text } from '@chakra-ui/react';

import openTab from '@/common/helpers/open-tab.helper';
import { FULL_TABS_ROUTES } from '@/common/constants/routes/tabs';

export default function LoginSection(): JSX.Element {
	return (
		<section className="popup_login">
			<Button
				onClick={() => openTab(FULL_TABS_ROUTES.login)}
				colorScheme="teal"
				w="100%"
			>
				Log in
			</Button>
			<Text mb={0}>
				Don't have an account?{' '}
				<Text
					onClick={() => openTab(FULL_TABS_ROUTES.registration)}
					color="teal.500"
					as="u"
					cursor="pointer"
					mb={0}
				>
					Please register
				</Text>
			</Text>
		</section>
	);
}
