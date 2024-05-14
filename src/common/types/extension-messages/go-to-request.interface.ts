import IBaseMsg from './base-msg.interface';

export default interface IGoToRequest extends IBaseMsg {
	serviceWorkerHandler: 'goTo';
	url: string;
}
