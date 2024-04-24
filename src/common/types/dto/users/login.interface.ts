import IUserInfo from '../../user-info';

export default interface ILoginDto extends IUserInfo {
	jwt: string;
}
