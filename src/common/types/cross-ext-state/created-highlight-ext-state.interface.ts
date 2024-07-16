import ICreateHighlightDto from '../dto/highlights/create-highlight.interface';

export default interface ICreateHighlightExtState {
	highlight: ICreateHighlightDto;
	pageUrl: string;
}
