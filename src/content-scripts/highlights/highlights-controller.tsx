import React, { useEffect, useState } from 'react';
import { CalendarIcon, SettingsIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import ReactTextareaAutosize from 'react-textarea-autosize';

import { DEF_COLORS } from '@/common/constants/colors';
import { ROOT_OPTIONS_ROUTE } from '@/common/constants/routes/options';
import callGoToSw from '@/service-worker/helpers/call-go-to-sw.helper';

export interface IHighlightsControllerProps {
	clientX: number;
	clientY: number;
	note?: string;
	onSelectColor: (color: string, note?: string) => void;
	onControllerClose: (color: string, note?: string) => void;
}

export default function HighlightsController({
	clientX,
	clientY,
	note,
	onSelectColor,
	onControllerClose,
}: IHighlightsControllerProps): JSX.Element {
	const { register, watch } = useForm<{ note?: string }>({
		values: {
			note,
		},
	});
	const [showNoteField, setShowNoteField] = useState(Boolean(note));

	useEffect(() => {
		return () => onControllerClose(DEF_COLORS[0].color, watch('note'));
	}, []);

	function calculatePosicionX(): number {
		const toEndPageSpacing = window.innerWidth - clientX - 250;
		if (toEndPageSpacing < 0) {
			return clientX - Math.abs(toEndPageSpacing);
		}
		return clientX;
	}

	return (
		<div
			className="highlighController"
			style={{
				zIndex: '999',
				position: 'fixed',
				top: clientY,
				left: calculatePosicionX(),
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
						marginRight: '-12px',
						width: '44px',
						height: '44px',
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
					className="highlighController_colors"
					style={{
						display: 'flex',
						padding: '6px',
						paddingLeft: '18px',
						borderRadius: '0 10px 10px 0',
						border: '1px solid #fff',
						boxShadow: 'rgba(255, 255, 255, 0.2) 0px 2px 8px 0px',
						backgroundColor: '#d4d4bf',
					}}
				>
					{DEF_COLORS.map(({ color }, index) => (
						<div
							key={index}
							onClick={() => onSelectColor(color, watch('note'))}
							className="highlighController_color"
							style={{
								cursor: 'pointer',
								margin: '0 2px',
								width: '24px',
								height: '24px',
								borderRadius: '50%',
								backgroundColor: color,
							}}
						/>
					))}
					<SettingsIcon
						onClick={() => callGoToSw({ url: ROOT_OPTIONS_ROUTE })}
						style={{
							cursor: 'pointer',
							margin: '0px 2px',
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
						width: '215px',
						margin: '3px',
						padding: '6px',
						backgroundColor: '#d4d4bf',
						borderRadius: '4px',
						resize: 'none',
					}}
					rows={5}
				/>
			)}
		</div>
	);
}
