import IGoToRequest from '@/common/types/extension-messages/go-to-request.interface';

export default async function goToSw({ url }: IGoToRequest): Promise<void> {
	chrome.tabs.create({ url });
}
