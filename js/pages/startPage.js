import { loadState } from "../utils/storage.js";
import { state, createListData } from "../state/state.js";
import { createMoreBtnModal } from "../components/modal.js";
import { importList } from "../utils/share.js";
import { createListField } from "../components/listField.js";

function createStartPage() {
    const startPage = document.createElement('div');
    startPage.classList.add('start-page');
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('start-page__title-container');
    const moreBtn = document.createElement('button');
    moreBtn.classList.add('start-page__button-more');
    moreBtn.addEventListener('click', () => {
        const backdrop = createMoreBtnModal([
            {
                name: 'Import',
                listener: () => importList()
            }
        ]);
        document.body.append(backdrop);
    })
    const title = document.createElement('h2');
    title.classList.add('start-page__title');
    title.textContent = 'My lists';
    titleContainer.append(title, moreBtn);
    startPage.appendChild(titleContainer);
    return startPage;
}

function createListsContainer() {
    const listsContainer = document.createElement('div');
    listsContainer.classList.add('lists-container');
    return listsContainer; 
}

function createAddListButton(listArea) {
    const addListButton = document.createElement('button');
    addListButton.textContent = 'Add list';
    addListButton.classList.add('lists-container__add-button');
    addListButton.addEventListener('click', () => {
        addListButton.classList.add('disabled');
        addListButton.disabled = true;
        const inputField = document.createElement('div');
        inputField.classList.add('lists-container__input-field')
        const input = document.createElement('input');
        input.classList.add('lists-container__input');
        input.type = 'text';
        input.placeholder = 'List name';
        const doneBtn = document.createElement('button');
        doneBtn.classList.add('lists-container__button-done');
        doneBtn.classList.add('disabled');
        doneBtn.disabled = true;
        input.addEventListener('input', (event) => {
            if(input.value.trim().length > 0) {
                doneBtn.classList.remove('disabled');
                doneBtn.disabled = false;
            } else {
                doneBtn.classList.add('disabled');
                doneBtn.disabled = true;
            }
        });
        doneBtn.addEventListener('click', () => {
            const listName = input.value.trim();
            inputField.remove();
            addListButton.classList.remove('disabled');
            addListButton.disabled = false;
            const listData = createListData(listName);
            const listField = createListField(listData);
            listArea.prepend(listField);
        });
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && input.value.trim().length > 0) {
                doneBtn.click();
            }
        });
        const cancelBtn = document.createElement('button');
        cancelBtn.classList.add('lists-container__button-cancel');
        cancelBtn.addEventListener('click', () => {
            inputField.remove();
            addListButton.classList.remove('disabled');
            addListButton.disabled = false;
        })
        inputField.append(input, doneBtn, cancelBtn);
        listArea.prepend(inputField);
        input.focus();
    })
    return addListButton;
}

export function renderStartPage() {
    state.editMode = false;
    state.currentListId = null;
    document.body.classList.remove('edit-mode');
    const startpage = createStartPage();
    const listsContainer = createListsContainer();
    loadState();
    let lists = state.lists;
    if (lists.length > 0) {
        lists.forEach((listData) => {
            let listField = createListField(listData);
            listsContainer.prepend(listField);
        });
    }
    const addButton = createAddListButton(listsContainer);
    listsContainer.appendChild(addButton);
    startpage.appendChild(listsContainer);
    document.body.appendChild(startpage);
}