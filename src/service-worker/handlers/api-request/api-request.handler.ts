import ApiServise from '@/common/services/api.service';
import { TRoLimiter } from '@/common/services/api.service.interface';
import IApiRequestIncomeMsg from '@/service-worker/types/income-msgs/api-request.income-msg.interface';
import IApiRequestOutcomeMsg from '@/service-worker/types/outcome-msgs/api-request.outcome-msg.interface';

export default async function apiRequestHandler<RO extends TRoLimiter>(
	{ method, url, data, contentScriptsHandler, serviceWorkerHandler }: IApiRequestIncomeMsg<RO>,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	if (!sender.tab?.id) return;

	const resp = await new ApiServise()[method](url, data);

	chrome.tabs.sendMessage<IApiRequestOutcomeMsg>(sender.tab.id, {
		serviceWorkerHandler,
		contentScriptsHandler,
		data: resp,
		incomeData: data,
	});
}
