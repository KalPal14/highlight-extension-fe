import IBaseHighlightDto from '../highlights/base/base-highlight.interface';

interface IEmptyPage {
	id: null;
}

interface IGetPage {
	id: number;
	userId: number;
	url: string;
	highlights: IBaseHighlightDto[] | null;
}

type TGetPageDto = IEmptyPage | IGetPage;

export default TGetPageDto;
