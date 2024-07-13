export default function getPageUrl(): string {
	if (location.hash.startsWith('#/')) {
		return location.href;
	}
	return location.origin + location.pathname;
}
