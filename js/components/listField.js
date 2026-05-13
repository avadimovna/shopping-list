import { clearPage } from "../utils/utils.js";
import { renderListPage } from "../pages/listPage.js";
import { createDeleteListModal } from "./modal.js";

export function createListField(listData) {
    const listField = document.createElement('div');
    listField.classList.add('list-field')
    const list = document.createElement('button');
    list.textContent = listData.name;
    list.index = listData.index;
    list.classList.add('list-field__list');
    list.addEventListener('click', () => {
        clearPage();
        renderListPage(listData);
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
