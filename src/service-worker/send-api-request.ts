import { USERS_API_ROUTES } from '@/common/constants/api-routes/users';
import ApiServise from '@/common/services/api.service';

chrome.runtime.onMessage.addListener(async function () {
	const resp = await new ApiServise().get(USERS_API_ROUTES.getUserInfo);
	console.log(resp);
});
