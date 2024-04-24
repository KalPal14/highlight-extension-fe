import IUserInfo from '../../user-info';

export default interface IRegistrationDto extends IUserInfo {
	jwt: string;
}
