import axios from 'axios';

import { HTTPError } from '@/errors/http-error';

export default interface IApiServise {
	get: <RO, DTO>(
		url: string,
		params?: RO,
		config?: axios.AxiosRequestConfig
	) => Promise<DTO | HTTPError>;
	post: <RO, DTO>(
		url: string,
		data?: RO,
		config?: axios.AxiosRequestConfig
	) => Promise<DTO | HTTPError>;
	patch: <RO, DTO>(
		url: string,
		data?: RO,
		config?: axios.AxiosRequestConfig
	) => Promise<DTO | HTTPError>;
	delete: <RO, DTO>(
		url: string,
		params?: RO,
		config?: axios.AxiosRequestConfig
	) => Promise<DTO | HTTPError>;
}
