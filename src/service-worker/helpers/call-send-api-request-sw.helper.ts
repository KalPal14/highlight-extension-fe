import { TRoLimiter } from '@/common/services/api.service.interface';
import IApiRequestMsg from '@/common/types/extension-messages/api-request-msg.interface';

export default function callSendApiRequestSw<RO extends TRoLimiter = undefined>({
	contentScriptsHandler,
	url,
	method,
	data = undefined,
}: Omit<IApiRequestMsg<RO>, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage<IApiRequestMsg<RO>>({
		serviceWorkerHandler: 'apiRequest',
		contentScriptsHandler,
		method,
		url,
		data,
	});
}
