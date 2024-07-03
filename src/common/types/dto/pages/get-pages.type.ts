import IBasePageDto from './base/base-page.interface';

type TGetPagesDto = (IBasePageDto & {
	highlightsCount: number;
	notesCount: number;
})[];

export default TGetPagesDto;
