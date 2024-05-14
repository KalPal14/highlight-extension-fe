export default function openTab(url: string): void {
	window.open(chrome.runtime.getURL(url));
}
