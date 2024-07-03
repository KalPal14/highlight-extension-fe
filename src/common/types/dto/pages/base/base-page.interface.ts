import IBaseHighlightDto from '../../highlights/base/base-highlight.interface';

export default interface IBasePageDto {
	id: number;
	userId: number;
	url: string;
	highlights: IBaseHighlightDto[] | null;
}
