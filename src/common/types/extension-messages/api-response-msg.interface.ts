import IBaseMsg from './base-msg.interface';

export default interface IApiResponseMsg extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	data: unknown;
}
