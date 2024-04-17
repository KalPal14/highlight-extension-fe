import INodeInRangeTextContent from './node-in-range-text-content.interface';

export default interface INodeInRange {
	node: Node;
	textContent: INodeInRangeTextContent;
}
