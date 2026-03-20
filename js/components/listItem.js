import { getCurrentList, saveList } from "../state/state.js";
import { state } from "../state/state.js";
import { createEditItemModal } from "./modal.js";

export function createListItem(itemData) {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    const label = document.createElement('span');
    label.classList.add('list-item__title');
    label.textContent = itemData.label;
    listItem.index = itemData.index;
    const dragBtn = document.createElement('button');
    dragBtn.classList.add('list-item__button-drag');
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('list-item__button-delete');
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteListItem(listItem);
    });
    listItem.addEventListener('click', () => {
        if (state.editMode) {
            handleItemClickInEditMode(listItem, label);
        } else {
            handleItemClick(listItem);
        }
    });
    listItem.append(dragBtn, label, deleteBtn);
    return listItem;
}

export function deleteListItem(listItem) {
    const listData = getCurrentList();
    listData.items = listData.items.filter((item) => item.index !== listItem.index);
    saveList(listData);
    listItem.remove();
}

function handleItemClickInEditMode(listItem, label) {
    const {backdrop, input} = createEditItemModal(listItem, label);
    document.body.append(backdrop);
    input.focus();
}

function handleItemClick(listItem) {
    const listData = getCurrentList();
    listItem.classList.toggle('list-item--completed');
    const index = listData.items.findIndex((item) => item.index === listItem.index);
    const itemData = listData.items[index];
    itemData.completed = !itemData.completed;
    listData.items[index] = itemData;
    saveList(listData);
}