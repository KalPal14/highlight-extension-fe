import IOpenSidepanelIncomeMsg from '@/service-worker/types/income-msgs/open-sidepanel.income-msg.interface';

export default function openSidepanelDispatcher({
	url,
}: Omit<IOpenSidepanelIncomeMsg, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage({
		url,
		serviceWorkerHandler: 'openSidepanel',
	});
}
