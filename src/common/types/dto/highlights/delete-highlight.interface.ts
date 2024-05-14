import IBaseHighlightDto from './base/base-highlight.interface';

export default interface IDeleteHighlightDto
	extends Omit<IBaseHighlightDto, 'startContainerId' | 'endContainerId'> {}
