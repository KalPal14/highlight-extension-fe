import IOpenSidepanelIncomeMsg from '@/service-worker/types/income-msgs/open-sidepanel.income-msg.interface';

export default async function openSidepanelHandler(
	{ url }: IOpenSidepanelIncomeMsg,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	if (!sender.tab?.id) return;
	chrome.sidePanel.setOptions({
		tabId: sender.tab.id,
		path: `sidepanel.html?url=${url}`,
		enabled: true,
	});
	await chrome.sidePanel.open({ tabId: sender.tab.id });
}
