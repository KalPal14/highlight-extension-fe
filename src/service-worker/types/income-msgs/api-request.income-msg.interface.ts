import IBaseMsg from '../base.msg.interface';

import IApiServise, { TRoLimiter } from '@/common/services/api.service.interface';

export default interface IApiRequestIncomeMsg<RO extends TRoLimiter = undefined> extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	method: keyof IApiServise;
	url: string;
	data?: RO;
}
