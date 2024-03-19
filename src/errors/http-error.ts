import { TErrorPayload } from './error-payload.type';

export class HTTPError extends Error {
	statusCode: number;
	payload: TErrorPayload;

	constructor(statusCode: number, payload: TErrorPayload) {
		super('HTTPError');
		this.statusCode = statusCode;
		this.payload = payload;
	}
}
