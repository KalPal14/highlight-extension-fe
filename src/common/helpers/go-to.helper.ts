export default function goTo(url: string): void {
	window.open(chrome.runtime.getURL(url));
}
