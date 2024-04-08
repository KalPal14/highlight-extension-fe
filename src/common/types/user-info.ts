import IColor from './color.interface';

export default interface IUserInfo {
	id: number;
	email: string;
	username: string;
	passwordUpdatedAt: string | null;
	colors: IColor[];
}
