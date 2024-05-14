import IBaseMsg from '../base.msg.interface';

export default interface IOpenTabIncomeMsg extends IBaseMsg {
	serviceWorkerHandler: 'openTab';
	url: string;
}
