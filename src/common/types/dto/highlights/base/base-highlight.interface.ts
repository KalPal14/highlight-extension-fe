import INodeRangeInfo from '../../../node-range-info.interface';

export default interface IBaseHighlightDto {
	id: number;
	pageId: number;
	startContainerId: number;
	endContainerId: number;
	startOffset: number;
	endOffset: number;
	text: string;
	color: string;
	note: string | null;
	startContainer: INodeRangeInfo;
	endContainer: INodeRangeInfo;
}
