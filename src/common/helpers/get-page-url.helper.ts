export default function getPageUrl(str: string = location.href): string {
	try {
		const url = new URL(str);
		if (url.hash.startsWith('#/')) {
			return url.href;
		}
		return url.origin + url.pathname;
	} catch {
		return str;
	}
}
