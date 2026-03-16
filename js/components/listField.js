import { clearPage } from "../utils/utils.js";
import { createListItem } from "./listItem.js";
import { createListPage } from "../pages/listPage.js";
import { createDeleteListModal } from "./modal.js";
import { state } from "../state/state.js";

export function createListField(listData) {
    const listField = document.createElement('div');
    listField.classList.add('list-field')
    const list = document.createElement('button');
    list.textContent = listData.name;
    list.index = listData.index;
    list.classList.add('list-field__list');
    list.addEventListener('click', () => {
        clearPage();
        state.currentListId = listData.index;
        const {listContainer: listContent, itemsContainer} = createListContent();
        listData.items.forEach((item) => {
            const listItem = createListItem(item);
            if (item.completed) {
                listItem.classList.add('list-item--completed');
            }
            itemsContainer.append(listItem);
        })
        const listPage = createListPage(listContent, itemsContainer);
        listPage.appendChild(listContent);
        document.body.appendChild(listPage);
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('list-field__button-delete');
    deleteBtn.addEventListener('click', () => {
        const backdrop = createDeleteListModal(listField, listData);
        document.body.append(backdrop);
    })
    listField.append(list, deleteBtn);
    return listField;
}

function createListContent() {
    const listContainer = document.createElement('div');
    listContainer.classList.add('list-page__container');
    const itemsContainer = document.createElement('div');
    itemsContainer.classList.add('list-page__items');
    listContainer.append(itemsContainer);
    return {listContainer, itemsContainer};
}