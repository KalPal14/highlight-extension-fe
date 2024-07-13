import { HTTPError } from './http-error';

interface IHttpErrHandler {
	err: HTTPError;
	onValidationErr?: (property: string, errors: string[]) => void;
	onErrWithMsg?: (msg: string) => void;
	onUnhandledErr?: () => void;
}

export default function httpErrHandler({
	err,
	onValidationErr,
	onErrWithMsg,
	onUnhandledErr,
}: IHttpErrHandler): void {
	if (Array.isArray(err.payload)) {
		if (!onValidationErr) return;
		err.payload.forEach(({ property, errors }) => onValidationErr(property, errors));
		return;
	}
	if (typeof err.payload !== 'string') {
		if (!onErrWithMsg) return;
		if (onUnhandledErr && err.statusCode === 500 && err.payload.err === 'Unexpected error') {
			onUnhandledErr();
			return;
		}
		onErrWithMsg(err.payload.err);
		return;
	}
	if (!onUnhandledErr) return;
	onUnhandledErr();
}
