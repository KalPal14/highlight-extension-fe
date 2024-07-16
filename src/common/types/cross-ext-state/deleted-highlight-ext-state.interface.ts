import IDeleteHighlightDto from '../dto/highlights/delete-highlight.interface';

export default interface IDeletedHighlightExtState {
	highlight: IDeleteHighlightDto;
	pageUrl: string;
}
