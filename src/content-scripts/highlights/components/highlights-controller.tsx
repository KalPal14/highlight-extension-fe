import React, { useEffect, useRef, useState } from 'react';
import { EditIcon, DeleteIcon, SettingsIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import ReactTextareaAutosize from 'react-textarea-autosize';
import cl from 'classnames';

import IHighlightControllerDynamicStyles from '../types/highlight-controller-dynamic-styles.interface';

import { DEF_COLORS } from '@/common/constants/default-values/colors';
import { FULL_OPTIONS_ROUTES } from '@/common/constants/routes/options';
import openTabDispatcher from '@/service-worker/handlers/open-tab/open-tab.dispatcher';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import IBaseUserDto from '@/common/types/dto/users/base/base-user-info.interface';
import openSidepanelDispatcher from '@/service-worker/handlers/open-sidepanel/open-sidepanel.dispatcher';
import getPageUrl from '@/common/helpers/get-page-url.helper';

export interface IHighlightsControllerProps {
	clientX: number;
	pageY: number;
	note?: string;
	forExistingHighlight?: boolean;
	onSelectColor: (color: string, note?: string) => void;
	onControllerClose: (color: string, note?: string) => void;
	onDeleteClick?: () => void;
}

export default function HighlightsController({
	clientX,
	pageY,
	note,
	forExistingHighlight,
	onSelectColor,
	onControllerClose,
	onDeleteClick = (): void => {},
}: IHighlightsControllerProps): JSX.Element {
	const firstColorRef = useRef(DEF_COLORS[0].color);

	const { register, watch } = useForm<{ note?: string }>({
		values: {
			note,
		},
	});
	const [currentUser] = useCrossExtState<IBaseUserDto | null>('currentUser', null);

	const [showNoteField, setShowNoteField] = useState(Boolean(note));
	const [colors, setColors] = useState(DEF_COLORS);

	useEffect(() => {
		return () => onControllerClose(firstColorRef.current, watch('note'));
	}, []);

	useEffect(() => {
		if (currentUser?.colors.length) {
			setColors(currentUser.colors);
			firstColorRef.current = currentUser.colors[0].color;
			return;
		}
		setColors(DEF_COLORS);
		firstColorRef.current = DEF_COLORS[0].color;
	}, [currentUser?.colors]);

	useEffect(() => {
		setShowNoteField(Boolean(note));
	}, [note]);

	function getColorsInOneLineAmount(): number {
		if (showNoteField && colors.length < 5) {
			return 5;
		}
		if (colors.length > 8) {
			return 8;
		}
		return colors.length;
	}
	function calculateDynamicStyles(): IHighlightControllerDynamicStyles {
		const colorBlockWidth = 26;
		const restControllerWidth = 79;
		const rightIndent = 30;
		const maxColorsInLine = 8;

		const colorsInOneLine = getColorsInOneLineAmount();
		const controllerWidth = colorBlockWidth * colorsInOneLine + restControllerWidth;
		const toEndPageSpacing = window.innerWidth - clientX - controllerWidth - rightIndent;

		const noteBtnMlAbs = colors.length <= maxColorsInLine ? 20 : 46;
		const noteTextareaMl = colors.length <= maxColorsInLine ? 4 : 0;
		const left = toEndPageSpacing < 0 ? clientX - Math.abs(toEndPageSpacing) : clientX;

		return {
			left,
			controllerWidth,
			noteTextareaMl,
			noteBtnMlAbs,
		};
	}
	const ds = calculateDynamicStyles();

	return (
		<article className="highlighController">
			<section
				className={cl('highlighController_topPanel', {
					'highlighController_topPanel-externalLinkOnly': !forExistingHighlight,
				})}
				style={{
					top: pageY - 40,
					left: ds.left,
				}}
			>
				{forExistingHighlight && <DeleteIcon onClick={onDeleteClick} />}
				<ExternalLinkIcon onClick={(): void => openSidepanelDispatcher({ url: getPageUrl() })} />
			</section>

			<section
				className="highlighController_mainPanel"
				style={{
					top: pageY,
					left: ds.left,
				}}
			>
				<div className="highlighController_mainPanelBtnsContainer">
					<div
						onClick={() => setShowNoteField(!showNoteField)}
						className="highlighController_noteBtn"
						style={{
							marginRight: `-${ds.noteBtnMlAbs}px`,
						}}
					>
						<EditIcon />
					</div>
					<div
						className="highlighController_colorsAndSettingsContainer"
						style={{
							paddingLeft: `${ds.noteBtnMlAbs}px`,
						}}
					>
						<ul className="highlighController_colors">
							{colors.map(({ color }, index) => (
								<li
									key={index}
									className="highlighController_color"
								>
									<div
										key={index}
										onClick={() => onSelectColor(color, watch('note'))}
										style={{
											backgroundColor: color,
										}}
									/>
								</li>
							))}
						</ul>

						<SettingsIcon
							onClick={() => openTabDispatcher({ url: FULL_OPTIONS_ROUTES.colors })}
							className="highlighController_settingsBtn"
						/>
					</div>
				</div>
				{showNoteField && (
					<ReactTextareaAutosize
						minRows={3}
						{...register('note')}
						placeholder="Note..."
						className="highlighController_noteTextarea"
						style={{
							width: `${ds.controllerWidth - 15}px`,
							marginLeft: `${ds.noteTextareaMl}px`,
						}}
						rows={5}
					/>
				)}
			</section>
		</article>
	);
}
