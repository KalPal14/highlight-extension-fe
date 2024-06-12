import openTabHandler from './handlers/open-tab/open-tab.handler';
import apiRequestHandler from './handlers/api-request/api-request.handler';
import IBaseMsg from './types/base.msg.interface';
import IApiRequestIncomeMsg from './types/income-msgs/api-request.income-msg.interface';
import IOpenTabIncomeMsg from './types/income-msgs/open-tab.income-msg.interface';
import openSidepanelHandler from './handlers/open-sidepanel/open-sidepanel.handler';
import IOpenSidepanelIncomeMsg from './types/income-msgs/open-sidepanel.income-msg.interface';

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
		case 'openSidepanel':
			openSidepanelHandler(msg as IOpenSidepanelIncomeMsg, sender);
	}
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
	if (!tab.url || !tabId) return;
	chrome.sidePanel.setOptions({
		tabId,
		path: `sidepanel.html?url=${tab.url}`,
		enabled: true,
	});
});
