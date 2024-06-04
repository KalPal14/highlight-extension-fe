import React, { useEffect, useRef, useState } from 'react';
import { CalendarIcon, DeleteIcon, SettingsIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import ReactTextareaAutosize from 'react-textarea-autosize';

import IHighlightControllerDynamicStyles from '../types/highlight-controller-dynamic-styles.interface';

import { DEF_COLORS } from '@/common/constants/default-values/colors';
import { ROOT_OPTIONS_ROUTE } from '@/common/constants/routes/options';
import openTabDispatcher from '@/service-worker/handlers/open-tab/open-tab.dispatcher';
import useCrossExtState from '@/common/hooks/cross-ext-state.hook';
import IBaseUserDto from '@/common/types/dto/users/base/base-user-info.interface';

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
		if (currentUser?.colors) {
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
		<>
			{forExistingHighlight && (
				<section
					className="highlighControllerTopPanel"
					onClick={onDeleteClick}
					style={{
						zIndex: '999',
						position: 'absolute',
						top: pageY - 40,
						left: ds.left,
						display: 'flex',
						padding: '6px',
						borderRadius: '10px',
						border: '1px solid #fff',
						boxShadow: 'rgba(255, 255, 255, 0.2) 0px 2px 8px 0px',
						backgroundColor: '#d4d4bf',
					}}
				>
					<DeleteIcon
						style={{
							cursor: 'pointer',
							width: '24px',
							color: '#4a4a4a',
						}}
					/>
				</section>
			)}

			<section
				className="highlighController"
				style={{
					zIndex: '999',
					position: 'absolute',
					top: pageY,
					left: ds.left,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						backgroundColor: 'rgba(255, 255, 255, 0)',
					}}
				>
					<div
						onClick={() => setShowNoteField(!showNoteField)}
						className="highlighController_noteBtn"
						style={{
							zIndex: 1,
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							marginRight: `-${ds.noteBtnMlAbs}px`,
							padding: '9px',
							borderRadius: '50%',
							border: '1px solid #fff',
							boxShadow: 'rgba(255, 255, 255, 0.2) 0px 2px 8px 0px',
							backgroundColor: '#4a4a4a',
						}}
					>
						<CalendarIcon
							style={{
								width: '24px',
								color: '#fff',
							}}
						/>
					</div>
					<div
						style={{
							display: 'flex',
							padding: '6px',
							paddingLeft: `${ds.noteBtnMlAbs}px`,
							borderRadius: '10px',
							border: '1px solid #fff',
							boxShadow: 'rgba(255, 255, 255, 0.2) 0px 2px 8px 0px',
							backgroundColor: '#d4d4bf',
						}}
					>
						<ul
							className="highlighController_colors"
							style={{
								display: 'flex',
								maxWidth: '208px',
								flexWrap: 'wrap',
								padding: 0,
								margin: 0,
							}}
						>
							{colors.map(({ color }, index) => (
								<li
									key={index}
									className="highlighController_color"
									style={{
										listStyle: 'none',
										flex: '0 1 23px',
										cursor: 'pointer',
										margin: '1px 1.5px',
									}}
								>
									<div
										key={index}
										onClick={() => onSelectColor(color, watch('note'))}
										style={{
											width: '23px',
											height: '23px',
											borderRadius: '50%',
											backgroundColor: color,
										}}
									/>
								</li>
							))}
						</ul>
						<SettingsIcon
							onClick={() => openTabDispatcher({ url: ROOT_OPTIONS_ROUTE })}
							style={{
								cursor: 'pointer',
								margin: '1px 2px',
								width: '24px',
								color: '#4a4a4a',
								paddingLeft: '4px',
								borderLeft: '1px solid #4a4a4a',
							}}
						/>
					</div>
				</div>
				{showNoteField && (
					<ReactTextareaAutosize
						minRows={3}
						{...register('note')}
						placeholder="Note..."
						style={{
							position: 'absolute',
							width: `${ds.controllerWidth - 15}px`,
							marginTop: '4px',
							marginLeft: `${ds.noteTextareaMl}px`,
							padding: '6px',
							backgroundColor: '#d4d4bf',
							borderRadius: '4px',
							resize: 'none',
						}}
						rows={5}
					/>
				)}
			</section>
		</>
	);
}
