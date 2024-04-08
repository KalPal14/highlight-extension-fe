import React from 'react';
import { DragHandleIcon, DeleteIcon } from '@chakra-ui/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { ArrayPath, FieldArray, FieldValues, UseFieldArrayReturn } from 'react-hook-form';
import { Button } from '@chakra-ui/react';

import './fields.scss';

import TJsxContent from '@/common/types/jsx-content.type';

export interface ISortableFieldsProps<Fields extends FieldValues> {
	useFieldArrayReturn: UseFieldArrayReturn<Fields>;
	fieldsList: JSX.Element[];
	addBtn?: {
		text: TJsxContent;
		value: FieldArray<Fields, ArrayPath<Fields>> | FieldArray<Fields, ArrayPath<Fields>>[];
	};
	showDeleteBtn?: boolean;
	afterRemoval?: (index: number) => void;
}

export default function SortableFields<Fields extends FieldValues>({
	useFieldArrayReturn,
	fieldsList,
	addBtn,
	showDeleteBtn,
}: ISortableFieldsProps<Fields>): JSX.Element {
	const { move, append, remove } = useFieldArrayReturn;

	function sortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void {
		move(oldIndex, newIndex);
	}

	function addElement(): void {
		if (!addBtn) return;
		append(addBtn.value);
	}

	function removeElement(index: number): void {
		remove(index);
	}

	function renderSortableElement(fields: JSX.Element, index: number): JSX.Element {
		const Handler = SortableHandle(() => (
			<DragHandleIcon
				className="sortableFields_iconBtn"
				cursor="grab"
			/>
		));
		const Element = SortableElement(() => (
			<li className="sortableFields_item">
				<div className="sortableFields_itemLeftBox">
					<Handler />
					<div className="sortableFields_customContentBox">{fields}</div>
				</div>
				<div className="sortableFields_itemRightBox">
					{showDeleteBtn && (
						<DeleteIcon
							onClick={() => removeElement(index)}
							className="sortableFields_iconBtn"
						/>
					)}
				</div>
			</li>
		));
		return (
			<Element
				key={fields.key}
				index={index}
			/>
		);
	}

	function renderSortableContainer(fieldsList: JSX.Element[]): JSX.Element {
		const Container = SortableContainer(() => (
			<>
				<ul className="sortableFields">
					{fieldsList.map((fields, index) => renderSortableElement(fields, index))}
				</ul>
				{addBtn && (
					<div className="sortableFields_addBtnContainer">
						<Button
							onClick={addElement}
							colorScheme="teal"
							variant="ghost"
						>
							{addBtn.text}
						</Button>
					</div>
				)}
			</>
		));
		return (
			<Container
				onSortEnd={sortEnd}
				useDragHandle={true}
			/>
		);
	}

	return renderSortableContainer(fieldsList);
}
