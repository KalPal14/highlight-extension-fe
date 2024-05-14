import openTabHandler from './handlers/open-tab/open-tab.handler';
import apiRequestHandler from './handlers/api-request/api-request.handler';
import IBaseMsg from './types/base.msg.interface';
import IApiRequestIncomeMsg from './types/income-msgs/api-request.income-msg.interface';
import IOpenTabIncomeMsg from './types/income-msgs/open-tab.income-msg.interface';

import { TRoLimiter } from '@/common/services/api.service.interface';

chrome.runtime.onMessage.addListener(async function <RO extends TRoLimiter>(
	msg: IBaseMsg,
	sender: chrome.runtime.MessageSender
) {
	switch (msg.serviceWorkerHandler) {
		case 'apiRequest':
			apiRequestHandler(msg as IApiRequestIncomeMsg<RO>, sender);
			return;
		case 'openTab':
			openTabHandler(msg as IOpenTabIncomeMsg);
			return;
	}
});
