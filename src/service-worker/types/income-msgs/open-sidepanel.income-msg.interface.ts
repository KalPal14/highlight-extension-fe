import IBaseMsg from '../base.msg.interface';

export default interface IOpenSidepanelIncomeMsg extends IBaseMsg {
	serviceWorkerHandler: 'openSidepanel';
	url: string;
}
