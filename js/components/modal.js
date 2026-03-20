import { getCurrentList, saveList, createItemData } from "../state/state.js";
import { createListItem } from "./listItem.js";
import { loadState, saveState } from "../utils/storage.js";
import { importList } from "../utils/share.js";
import { state } from "../state/state.js";

export function createListItemModal(itemsContainer, position) {
    const listData = getCurrentList();
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalTitle = document.createElement('p');
    modalTitle.classList.add('modal__title');
    modalTitle.textContent = 'Add item';
    const input = document.createElement('input');
    input.classList.add('modal__input');
    input.addEventListener('input', () => {
        if(input.value.trim().length > 0) {
                okBtn.classList.remove('disabled');
                okBtn.disabled = false;
                nextBtn.classList.remove('disabled');
                nextBtn.disabled = false;
            } else {
                okBtn.classList.add('disabled');
                okBtn.disabled = true;
                nextBtn.classList.add('disabled');
                nextBtn.disabled = true;
            }
     });
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('modal__buttons-container')
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('modal__button-next');
    nextBtn.classList.add('disabled');
    nextBtn.textContent = "Next";
    nextBtn.addEventListener('click', () => {
        const itemData = createItemData(input.value.trim());
        const listItem = createListItem(itemData);
        if (position === 'top') {
            listData.items.unshift(itemData);
            itemsContainer.prepend(listItem);
        } else {
            listData.items.push(itemData);
            itemsContainer.append(listItem);
        }
        saveList(listData);
        input.value = '';
        input.focus();
        nextBtn.classList.add('disabled');
        nextBtn.disabled = true;
        okBtn.classList.add('disabled');
        okBtn.disabled = true;
    })
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('modal__button-cancel');
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener('click', () => {
        backdrop.remove();
    })
    const okBtn = document.createElement('button');
    okBtn.classList.add('modal__button-ok');
    okBtn.classList.add('disabled');
    okBtn.textContent = "OK";
    okBtn.addEventListener('click', () => {
        const itemData = createItemData(input.value.trim());
        const listItem = createListItem(itemData);
         if (position === 'top') {
            listData.items.unshift(itemData);
            itemsContainer.prepend(listItem);
        } else {
            listData.items.push(itemData);
            itemsContainer.append(listItem);
        }
        saveList(listData);
        backdrop.remove();
    })
    buttonsContainer.append(nextBtn, cancelBtn, okBtn);
    modal.append(modalTitle, input, buttonsContainer);
    backdrop.addEventListener('click', (event) => {
        if (!modal.contains(event.target)) {
            backdrop.remove();
        }
    })
    backdrop.append(modal);
    return { backdrop, input};
}

export function createEditItemModal(listItem, label) {
    const listData = getCurrentList();
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalTitle = document.createElement('p');
    modalTitle.classList.add('modal__title');
    modalTitle.textContent = 'Edit';
    const input = document.createElement('input');
    input.classList.add('modal__input');
    input.value = listItem.textContent;
    input.addEventListener('input', () => {
        if(input.value.trim().length > 0) {
                okBtn.classList.remove('disabled');
                okBtn.disabled = false;
            } else {
                okBtn.classList.add('disabled');
                okBtn.disabled = true;
            }
     });
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('modal__buttons-container')
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('modal__button-cancel');
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener('click', () => {
        backdrop.remove();
    })
    const okBtn = document.createElement('button');
    okBtn.classList.add('modal__button-ok');
    okBtn.textContent = "OK";
    okBtn.addEventListener('click', () => {
        label.textContent = input.value.trim();
        let index = listData.items.findIndex((item) => item.index === listItem.index);
        listData.items[index].label = input.value.trim();
        saveList(listData);
        backdrop.remove();
    })
    buttonsContainer.append(cancelBtn, okBtn);
    modal.append(modalTitle, input, buttonsContainer);
    backdrop.addEventListener('click', (event) => {
        if (!modal.contains(event.target)) {
            backdrop.remove();
        }
    })
    backdrop.append(modal);
    return { backdrop, input};
}

export function createDeleteListModal(listField, listData) {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalTitle = document.createElement('p');
    modalTitle.classList.add('modal__title');
    modalTitle.textContent = 'Are you sure?';
    const modalText = document.createElement('p');
    modalText.classList.add('modal__title');
    modalText.textContent = 'This list will be gone forever';
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('modal__buttons-container')
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('modal__button-cancel');
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener('click', () => {
        backdrop.remove();
    })
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('modal__button-delete');
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener('click', () => {
        loadState();
        state.lists = state.lists.filter((list) => list.index !== listData.index);
        saveState();
        listField.remove();
        backdrop.remove();
    });
    buttonsContainer.append(cancelBtn, deleteBtn);
    modal.append(modalTitle, modalText, buttonsContainer);
    backdrop.addEventListener('click', (event) => {
        if (!modal.contains(event.target)) {
            backdrop.remove();
        }
    })
    backdrop.append(modal);
    return backdrop;
}

export function createMoreBtnModal(options) {
    const backdrop = document.createElement('div');
    backdrop.classList.add('more-button-backdrop');
    const modal = document.createElement('ul');
    modal.classList.add('more-modal');
    options.forEach((option) => {
        const optionItem = document.createElement('li');
        optionItem.classList.add('more-modal__option');
        if (option.name === 'Import') {
            const label = document.createElement('label');
            label.classList.add('more-modal__label')
            label.textContent = option.name;
            const input = document.createElement('input');
            input.classList.add('more-modal__input');
            input.type = 'file';
            input.accept = '.json';
            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    importList(file);
                    backdrop.remove();
                }
            });
            label.appendChild(input);
            optionItem.appendChild(label);
        } else {
            backdrop.remove();
            optionItem.textContent = option.name;
            optionItem.addEventListener('click', option.listener);
        }
        modal.appendChild(optionItem);
    });
    backdrop.appendChild(modal);
    backdrop.addEventListener('click', (event) => {
        if (!modal.contains(event.target)) {
            backdrop.remove();
        }
    })
    return backdrop;
}