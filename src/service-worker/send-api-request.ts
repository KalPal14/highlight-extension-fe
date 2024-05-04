import ApiServise from '@/common/services/api.service';
import { TRoLimiter } from '@/common/services/api.service.interface';
import IApiRequestMsg from '@/common/types/extension-messages/api-request-msg.interface';
import IApiResponseMsg from '@/common/types/extension-messages/api-response-msg.interface';

export default async function sendApiRequest<RO extends TRoLimiter>(
	{ method, url, data, contentScriptsHandler, serviceWorkerHandler }: IApiRequestMsg<RO>,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	if (!sender.tab?.id) return;

	const resp = await new ApiServise()[method](url, data);

	chrome.tabs.sendMessage<IApiResponseMsg>(sender.tab.id, {
		serviceWorkerHandler,
		contentScriptsHandler,
		data: resp,
	});
}
