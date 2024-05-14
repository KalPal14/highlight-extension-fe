import IOpenTabIncomeMsg from '@/service-worker/types/income-msgs/open-tab.income-msg.interface';

export default function openTabDispatcher({
	url,
}: Omit<IOpenTabIncomeMsg, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage<IOpenTabIncomeMsg>({
		serviceWorkerHandler: 'openTab',
		url,
	});
}
