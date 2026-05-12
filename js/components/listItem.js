import { getCurrentList, saveList } from "../state/state.js";
import { state } from "../state/state.js";
import { createEditItemModal } from "./modal.js";

export function createListItem(itemData, container) {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    const label = document.createElement('span');
    label.classList.add('list-item__title');
    label.textContent = itemData.label;
    listItem.index = itemData.index;
    const dragBtn = document.createElement('button');
    dragBtn.classList.add('list-item__button-drag');
    dragBtn.addEventListener('mousedown', (e) => dragItem(e.clientY, listItem, container));
    dragBtn.addEventListener('touchstart', (e) => dragItem(e.touches[0].clientY, listItem, container));
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

function dragItem(clientY, listItem, container) {
    const rect = listItem.getBoundingClientRect();

    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.height = rect.height + 'px';
    placeholder.style.width = '100%';
    listItem.parentNode.insertBefore(placeholder, listItem);

    // listItem.style.width = rect.width + 'px';
    listItem.classList.add('is-dragging');
    const offsetY = clientY - rect.top;

    listItem.style.left = rect.left + 'px';
    listItem.style.top = rect.top + 'px';


    function onMouseMove(event) {
        event.preventDefault();
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const items = [...container.children];
        const filtered = items.filter(item => item !== listItem && item !== placeholder);
        const thresholdTop = window.innerHeight * 0.2;
        const thresholdBottom = window.innerHeight * 0.8;

        if (clientY < thresholdTop) {
            window.scrollBy(0, -7);
        } else if (clientY > thresholdBottom) {
            window.scrollBy(0, 7);
        }

        listItem.style.top = clientY - offsetY + 'px';
        let target = null;

        for (let el of filtered) {
            const rect = el.getBoundingClientRect();
            const middle = rect.top + rect.height / 2;

            if (clientY < middle) {
                target = el;
                break;
            }
        }
        placeholder.remove();
        if (target) {
          target.insertAdjacentElement('beforebegin', placeholder);  
        } else {
            container.appendChild(placeholder);
        }
    }

    function onMouseUp() {
        listItem.classList.remove('is-dragging');
        placeholder.insertAdjacentElement('beforebegin', listItem);
        placeholder.remove();
        const actualList = [...container.children];
        const indexList = actualList.map(item => item.index);
        console.log(indexList);
        const listData = getCurrentList();
        listData.items.sort((a, b) => indexList.indexOf(a.index) - indexList.indexOf(b.index));
        console.log(listData.items);
        saveList(listData);
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('touchmove', onMouseMove, { passive: false });
        container.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('touchend', onMouseUp);
    }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchmove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchend', onMouseUp);
}