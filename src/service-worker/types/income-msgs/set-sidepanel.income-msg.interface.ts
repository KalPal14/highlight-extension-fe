import IBaseMsg from '../base.msg.interface';

export default interface ISetSidepanelIncomeMsg extends IBaseMsg {
	serviceWorkerHandler: 'openSidepanel';
	url: string;
	enabled: boolean;
}
