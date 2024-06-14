import IBaseHighlightDto from '@/common/types/dto/highlights/base/base-highlight.interface';

export default interface IChangeHighlightForm {
	highlights: {
		highlight: IBaseHighlightDto;
	}[];
}
