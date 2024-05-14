import IGoToRequest from '@/common/types/extension-messages/go-to-request.interface';

export default function callGoToSw({ url }: Omit<IGoToRequest, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage<IGoToRequest>({
		serviceWorkerHandler: 'goTo',
		url,
	});
}
