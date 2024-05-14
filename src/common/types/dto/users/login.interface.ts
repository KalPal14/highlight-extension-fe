import IUserInfo from './base/user-info';

export default interface ILoginDto extends IUserInfo {
	jwt: string;
}
