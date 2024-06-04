import IUserInfo from './base/base-user-info.interface';

export default interface ILoginDto extends IUserInfo {
	jwt: string;
}
