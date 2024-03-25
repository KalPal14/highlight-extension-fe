import React from 'react';
import { Button, Text } from '@chakra-ui/react';

import goTo from '@/common/helpers/go-to.helper';
import { FULL_TABS_ROUTES } from '@/common/constants/routes/tabs';

export default function LoginSection(): JSX.Element {
	return (
		<section className="popup_login">
			<Button
				onClick={() => goTo(FULL_TABS_ROUTES.login)}
				colorScheme="teal"
				w="100%"
			>
				Log in
			</Button>
			<Text>
				Don't have an account?{' '}
				<Text
					onClick={() => goTo(FULL_TABS_ROUTES.registration)}
					color="teal.500"
					as="u"
				>
					Please register
				</Text>
			</Text>
		</section>
	);
}
