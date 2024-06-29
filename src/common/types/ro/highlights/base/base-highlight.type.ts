import INodeRangeInfo from '@/common/types/node-range-info.interface';

type TBaseHighlightRo = {
	pageUrl: string;
	order: number;
	startContainer: INodeRangeInfo;
	endContainer: INodeRangeInfo;
	startOffset: number;
	endOffset: number;
	text: string;
	color: string;
	note?: string;
};

export default TBaseHighlightRo;
