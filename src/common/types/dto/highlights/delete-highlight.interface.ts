import IBaseHighlightDto from './base-highlight.interface';

export default interface IDeleteHighlightDto
	extends Omit<IBaseHighlightDto, 'startContainerId' | 'endContainerId'> {}
