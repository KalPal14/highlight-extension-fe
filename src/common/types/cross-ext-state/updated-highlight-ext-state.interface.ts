import IUpdateHighlightDto from '../dto/highlights/update-highlight.interface';

export default interface IUpdatedHighlightExtState {
	highlight: IUpdateHighlightDto;
	pageUrl: string;
}
