export default function getUrlSearchParam(key: string): string | null {
	const params = new URL(window.location.href).searchParams;
	return params.get(key);
}
