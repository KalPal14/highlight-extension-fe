const url = process.env.BASE_API_URL ?? '';

export async function getCookie(key: string): Promise<chrome.cookies.Cookie | null> {
	return await new Promise((resolve) => {
		chrome.cookies.get(
			{
				url,
				name: key,
			},
			(cookie) => {
				return resolve(cookie);
			}
		);
	});
}
