import { THttpErrorPayload } from './http-error-payload.type';

export class HTTPError extends Error {
	statusCode: number;
	payload: THttpErrorPayload;

	constructor(statusCode: number, payload: THttpErrorPayload) {
		super('HTTPError');
		this.statusCode = statusCode;
		this.payload = payload;
	}
}
