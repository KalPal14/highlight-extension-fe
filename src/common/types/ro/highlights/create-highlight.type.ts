import INodeRangeInfo from '@/common/types/node-range-info.interface';

type TCreateHighlightRo = {
	pageUrl: string;
	startContainer: INodeRangeInfo;
	endContainer: INodeRangeInfo;
	startOffset: number;
	endOffset: number;
	text: string;
	color: string;
	note?: string;
};

export default TCreateHighlightRo;
