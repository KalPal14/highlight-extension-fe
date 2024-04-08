import React from 'react';
import { DragHandleIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { FieldArray, FieldValues, UseFieldArrayReturn } from 'react-hook-form';

import './fields.scss';

export interface ISortableFieldsProps<Fields extends FieldValues> {
	useFieldArrayReturn: UseFieldArrayReturn<Fields>;
	fieldsList: JSX.Element[];
	showAddBtn?: boolean;
	showDeleteBtn?: boolean;
	afterRemoval?: (index: number) => void;
}

export default function SortableFields<Fields extends FieldValues>({
	useFieldArrayReturn,
	fieldsList,
	showAddBtn,
	showDeleteBtn,
	afterRemoval,
}: ISortableFieldsProps<Fields>): JSX.Element {
	const { fields, move, insert, remove } = useFieldArrayReturn;

	function sortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void {
		move(oldIndex, newIndex);
	}

	function addElement(index: number): void {
		const { id: _id, ...rest } = fields[index];
		insert(index + 1, { ...rest } as FieldArray<Fields>);
	}

	function removeElement(index: number): void {
		remove(index);
		if (afterRemoval) {
			afterRemoval(index);
		}
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
					{showAddBtn && (
						<AddIcon
							onClick={() => addElement(index)}
							className="sortableFields_iconBtn"
						/>
					)}
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
			<ul className="sortableFields">
				{fieldsList.map((fields, index) => renderSortableElement(fields, index))}
			</ul>
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
