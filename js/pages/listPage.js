import { clearPage } from "../utils/utils.js";
import { renderStartPage } from "./startPage.js";
import { state, getCurrentList } from "../state/state.js";
import { createMoreBtnModal, createListItemModal } from "../components/modal.js";
import { exportList, shareList } from "../utils/share.js";
import { loadState, saveState } from "../utils/storage.js";


export function createListPage(listContent, itemsContainer) {
    const listData = getCurrentList();
    const listPage = document.createElement('div');
    listPage.classList.add('list-page');
    const titleField = document.createElement('div');
    titleField.classList.add('list-page__title-field');
    const backBtn = document.createElement('button');
    backBtn.classList.add('list-page__button-back');

    backBtn.addEventListener('click', () => {
        clearPage();
        renderStartPage();
    })
    const title = document.createElement('h2');
    title.classList.add('list-page__title');
    title.textContent = listData.name;
    const editBtn = document.createElement('button');
    editBtn.classList.add('list-page__button-edit');

    editBtn.addEventListener('click', () => {
        state.editMode = true;
        document.body.classList.add('edit-mode');
        const input = document.createElement('input');
        input.classList.add('list-page__input');
        input.type = 'text';
        input.placeholder = 'List name';
        input.value = listData.name;
        title.classList.add('hidden');
        editBtn.classList.add('hidden');
        backBtn.classList.add('hidden');
        const doneBtn = document.createElement('button');
        doneBtn.classList.add('list-page__button-done');
        const addListItemTopBtn = createAddListItemButton(itemsContainer, 'top');
        const addListItemBottomBtn = createAddListItemButton(itemsContainer, 'bottom');

        doneBtn.addEventListener('click', () => {
            state.editMode = false;
            document.body.classList.remove('edit-mode');
            const newName = input.value.trim();
            title.textContent = newName;
            input.remove();
            doneBtn.remove();
            addListItemTopBtn.remove();
            addListItemBottomBtn.remove();
            title.classList.remove('hidden');
            editBtn.classList.remove('hidden');
            backBtn.classList.remove('hidden');
            listData.name = newName;
            loadState();
            let index = state.lists.findIndex((list) => list.index === listData.index);
            state.lists[index].name = newName;
            saveState();
          
        });

        input.addEventListener('input', () => {
            if(input.value.trim().length > 0) {
                doneBtn.classList.remove('disabled');
                doneBtn.disabled = false;
            } else {
                doneBtn.classList.add('disabled');
                doneBtn.disabled = true;
            }
        });
        listContent.prepend(addListItemTopBtn);
        listContent.append(addListItemBottomBtn);
        titleField.prepend(input);
        titleField.prepend(doneBtn);
    })
    const moreBtn = document.createElement('button');
    moreBtn.classList.add('list-page__button-more');
    moreBtn.addEventListener('click', () => {
        const backdrop = createMoreBtnModal([
            {
                name: 'Export',
                listener: () => exportList()
            },
            {
                 name: 'Share',
                 listener: () => {
                    document.querySelector('.more-button-backdrop')?.remove();
                    shareList();
                }
            }
        ]);
        document.body.append(backdrop);
    })
    titleField.append(backBtn, title, editBtn, moreBtn);
    listPage.appendChild(titleField);
    return listPage;
}

function createAddListItemButton(itemsContainer, position) {
    const addListItemBtn = document.createElement('button');
    addListItemBtn.classList.add('list-page__button-add-item');
    addListItemBtn.textContent = 'Add item';
    addListItemBtn.addEventListener('click', () => {
        const { backdrop, input } = createListItemModal(itemsContainer, position);
        document.body.append(backdrop);
        input.focus();
    })
    return addListItemBtn;
}