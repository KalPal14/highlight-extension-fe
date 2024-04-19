import axios from 'axios';

import IApiServise from './api.service.interface';

import { HTTPError } from '@/errors/http-error';

export default class ApiServise implements IApiServise {
	private baseUrl: string | undefined;
	private axiosInstance: axios.AxiosInstance;

	constructor() {
		this.baseUrl = process.env.BASE_API_URL;
		if (!this.baseUrl) {
			throw new Error('There is no BASE_API_URL variable in your env file');
		}

		this.axiosInstance = axios.create({
			baseURL: this.baseUrl,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			withCredentials: true,
		});
	}

	get<RO, DTO>(
		url: string,
		params?: RO,
		config?: axios.AxiosRequestConfig
	): Promise<DTO | HTTPError> {
		return new Promise((resolve) => {
			this.axiosInstance
				.get(url, {
					params,
					...config,
				})
				.then((resp) => resolve(resp.data))
				.catch(({ response }) => resolve(new HTTPError(response.status, response.data)));
		});
	}

	post<RO, DTO>(
		url: string,
		data?: RO,
		config?: axios.AxiosRequestConfig
	): Promise<DTO | HTTPError> {
		return new Promise((resolve) => {
			this.axiosInstance
				.post(url, data, config)
				.then((resp) => resolve(resp.data))
				.catch(({ response }) => resolve(new HTTPError(response.status, response.data)));
		});
	}

	patch<RO, DTO>(
		url: string,
		data?: RO,
		config?: axios.AxiosRequestConfig
	): Promise<DTO | HTTPError> {
		return new Promise((resolve) => {
			this.axiosInstance
				.patch(url, data, config)
				.then((resp) => resolve(resp.data))
				.catch(({ response }) => resolve(new HTTPError(response.status, response.data)));
		});
	}

	delete<RO, DTO>(
		url: string,
		params?: RO,
		config?: axios.AxiosRequestConfig
	): Promise<DTO | HTTPError> {
		return new Promise((resolve) => {
			this.axiosInstance
				.delete(url, {
					params,
					...config,
				})
				.then((resp) => resolve(resp.data))
				.catch(({ response }) => resolve(new HTTPError(response.status, response.data)));
		});
	}
}
