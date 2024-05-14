import IUserInfo from './base/user-info';

export default interface IRegistrationDto extends IUserInfo {
	jwt: string;
}
