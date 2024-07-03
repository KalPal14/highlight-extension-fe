import IBasePageDto from './base/base-page.interface';

interface IEmptyPage {
	id: null;
}

type TGetPageDto = IEmptyPage | IBasePageDto;

export default TGetPageDto;
