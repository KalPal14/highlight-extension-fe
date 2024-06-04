import IUserInfo from './base/base-user-info.interface';

export default interface IRegistrationDto extends IUserInfo {
	jwt: string;
}
