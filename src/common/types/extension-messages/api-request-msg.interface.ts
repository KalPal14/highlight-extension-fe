import IBaseMsg from './base-msg.interface';

import IApiServise, { TRoLimiter } from '@/common/services/api.service.interface';

export default interface IApiRequestMsg<RO extends TRoLimiter = undefined> extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	method: keyof IApiServise;
	url: string;
	data?: RO;
}
