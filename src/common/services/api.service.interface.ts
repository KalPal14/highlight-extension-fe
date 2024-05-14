import { HTTPError } from '@/errors/http-error/http-error';

export type TRoLimiter = Record<string, unknown> | null | undefined;

type TFetch = <RO extends TRoLimiter, DTO>(url: string, data?: RO) => Promise<DTO | HTTPError>;

export default interface IApiServise {
	get: TFetch;
	post: TFetch;
	patch: TFetch;
	delete: TFetch;
}
