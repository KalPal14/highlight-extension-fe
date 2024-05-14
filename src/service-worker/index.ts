import sendApiRequest from './send-api-request';
import goToSw from './go-to.sw';

import { TRoLimiter } from '@/common/services/api.service.interface';
import IApiRequestMsg from '@/common/types/extension-messages/api-request-msg.interface';
import IBaseMsg from '@/common/types/extension-messages/base-msg.interface';
import IGoToRequest from '@/common/types/extension-messages/go-to-request.interface';

chrome.runtime.onMessage.addListener(async function <RO extends TRoLimiter>(
	msg: IBaseMsg,
	sender: chrome.runtime.MessageSender
) {
	switch (msg.serviceWorkerHandler) {
		case 'apiRequest':
			sendApiRequest(msg as IApiRequestMsg<RO>, sender);
			return;
		case 'goTo':
			goToSw(msg as IGoToRequest);
			return;
	}
});
