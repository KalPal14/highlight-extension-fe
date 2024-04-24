import IApiServise, { TRoLimiter } from './api.service.interface';

import { HTTPError } from '@/errors/http-error';

export default class ApiServise implements IApiServise {
	private baseUrl: string | undefined;
	private initRequest: RequestInit;

	constructor(initRequest?: Omit<RequestInit, 'method' | 'body'>) {
		this.baseUrl = process.env.BASE_API_URL;
		if (!this.baseUrl) {
			throw new Error('There is no BASE_API_URL variable in your env file');
		}

		this.initRequest = {
			...initRequest,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				...initRequest?.headers,
			},
		};
	}

	private createSearchParams<RO extends TRoLimiter>(data: RO): URLSearchParams {
		const searchParamsData: Record<string, string> = {};
		for (const key in data) {
			if (typeof data[key] === 'object') {
				searchParamsData[key] = JSON.stringify(data[key]);
				continue;
			}
			searchParamsData[key] = String(data[key]);
		}
		return new URLSearchParams(searchParamsData);
	}

	async get<RO extends TRoLimiter, DTO>(url: string, data?: RO): Promise<DTO | HTTPError> {
		try {
			const params = data ? `?${this.createSearchParams(data)}` : '';
			const resp = await fetch(`${this.baseUrl}${url}${params}`, {
				...this.initRequest,
				method: 'GET',
			});
			if (resp.ok) {
				return await resp.json();
			}
			return new HTTPError(resp.status, await resp.json());
		} catch (e) {
			return new HTTPError(500, 'Unknown error');
		}
	}

	private async fetchLayout<RO extends TRoLimiter, DTO>(
		method: 'POST' | 'PATCH' | 'DELETE',
		url: string,
		data?: RO
	): Promise<DTO | HTTPError> {
		try {
			const resp = await fetch(`${this.baseUrl}${url}`, {
				...this.initRequest,
				method,
				body: JSON.stringify(data),
			});
			if (resp.ok) {
				return await resp.json();
			}
			return new HTTPError(resp.status, await resp.json());
		} catch (e) {
			return new HTTPError(500, 'Unknown error');
		}
	}

	async post<RO extends TRoLimiter, DTO>(url: string, data?: RO): Promise<DTO | HTTPError> {
		return await this.fetchLayout('POST', url, data);
	}

	async patch<RO extends TRoLimiter, DTO>(url: string, data?: RO): Promise<DTO | HTTPError> {
		return await this.fetchLayout('PATCH', url, data);
	}

	async delete<RO extends TRoLimiter, DTO>(url: string, data?: RO): Promise<DTO | HTTPError> {
		return await this.fetchLayout('DELETE', url, data);
	}
}
