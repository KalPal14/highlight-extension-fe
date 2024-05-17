import IBaseMsg from '../base.msg.interface';

export default interface IApiRequestOutcomeMsg extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	data: unknown;
	incomeData: unknown;
}
