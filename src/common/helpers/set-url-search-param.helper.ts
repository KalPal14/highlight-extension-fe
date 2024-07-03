export default function setUrlSearchParam(key: string, value: string): void {
	const url = new URL(window.location.href);
	url.searchParams.set(key, value);
	history.pushState(null, '', url);
}
