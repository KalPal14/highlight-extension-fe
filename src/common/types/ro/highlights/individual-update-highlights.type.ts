import TBaseHighlightRo from './base/base-highlight.type';

type TIndividualUpdateHighlightsRo = {
	highlights: { id: number; payload: Partial<TBaseHighlightRo> }[];
};

export default TIndividualUpdateHighlightsRo;
