const state = {
    lists: [],
    currentListId: null,
    editMode: false
};

function getCurrentList() {
    return state.lists.find(list => list.index === state.currentListId);
}

function loadState() {
    state.lists = JSON.parse(localStorage.getItem('lists')) || [];
}

function saveState() {
    localStorage.setItem('lists', JSON.stringify(state.lists));
}


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

function createListsArea() {
    const listsArea = document.createElement('div');
    listsArea.classList.add('lists-area');
    return listsArea; 
}

function createAddListButton(listArea) {
    const addListButton = document.createElement('button');
    addListButton.textContent = 'Add list';
    addListButton.classList.add('lists-area__add-button');
    addListButton.addEventListener('click', () => {
        addListButton.classList.add('disabled');
        addListButton.disabled = true;
        const inputField = document.createElement('div');
        inputField.classList.add('lists-area__input-field')
        const input = document.createElement('input');
        input.classList.add('lists-area__input');
        input.type = 'text';
        input.placeholder = 'List name';
        const doneBtn = document.createElement('button');
        doneBtn.classList.add('lists-area__button-done');
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
        cancelBtn.classList.add('lists-area__button-cancel');
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

function createListField(listData) {
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

function createListData(name) {
    loadState();
    const listData = {
        index: generateIndex(state.lists),
        name,
        items: []
    };
    state.lists.push(listData);
    saveState();
    return listData;

}

function generateIndex(array) {
    let maxId = 0;
    if(array.length > 0) {
        maxId = Math.max(...array.map(item => item.index));
    }
    return maxId + 1;
}

function renderStartPage() {
    state.editMode = false;
    state.currentListId = null;
    document.body.classList.remove('edit-mode');
    const startpage = createStartPage();
    const listsArea = createListsArea();
    loadState();
    let lists = state.lists;
    if (lists.length > 0) {
        lists.forEach((listData) => {
            let listField = createListField(listData);
            listsArea.prepend(listField);
        });
    }
    const addButton = createAddListButton(listsArea);
    listsArea.appendChild(addButton);
    startpage.appendChild(listsArea);
    document.body.appendChild(startpage);
}

renderStartPage();

function createListPage(listContent, itemsContainer) {
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
            title.textContent = newName
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
            }
        ]);
        document.body.append(backdrop);
    })
    titleField.append(backBtn, title, editBtn, moreBtn);
    listPage.appendChild(titleField);
    return listPage;
}

function handleItemClickInEditMode(listItem) {
    const {backdrop, input} = createEditItemModal(listItem);
    document.body.append(backdrop);
    input.focus();
}

function createListContent() {
    const listContainer = document.createElement('div');
    listContainer.classList.add('list-page__container');
    const itemsContainer = document.createElement('div');
    itemsContainer.classList.add('list-page__items');
    listContainer.append(itemsContainer);
    return {listContainer, itemsContainer};
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

function createListItemModal(itemsContainer, position) {
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

function createEditItemModal(listItem) {
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
        listItem.textContent = input.value.trim();
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

function createDeleteListModal(listField, listData) {
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

function createListItem(itemData) {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    const label = document.createElement('span');
    label.textContent = itemData.label;
    listItem.index = itemData.index;
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('list-item__button-delete');
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteListItem(listItem);
    });
    listItem.addEventListener('click', () => {
        if (state.editMode) {
            handleItemClickInEditMode(listItem);
        } else {
            handleItemClick(listItem);
        }
    });
    listItem.append(label, deleteBtn);
    return listItem;
}

function deleteListItem(listItem) {
    const listData = getCurrentList();
    listData.items = listData.items.filter((item) => item.index !== listItem.index);
    saveList(listData);
    listItem.remove();
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

function createDataString() {
    const listData = getCurrentList();
    const exportData = {
        version: 1,
        type: 'shopping-list',
        data: listData
    }
    return JSON.stringify(exportData);
}

function createMoreBtnModal(options) {
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

function exportList() {
    const listData = getCurrentList();
    const dataStr = createDataString();
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${listData.name}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

async function shareList() {
    const listData = getCurrentList();
    const dataStr = createDataString();
    const file = new File(
        [dataStr],
        `${listData.name}.json`,
        {type: "application/json"}
    );
    if(navigator.share) {
        await (navigator.share({
            files: [file],
            title: listData.name,
            text: "Shopping list"
        }));
    } else {
        exportList();
    }
}

function importList(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileData = JSON.parse(event.target.result);
        const listData = fileData.data;
        loadState();
        listData.index = generateIndex(state.lists);
        state.lists.push(listData);
        saveState();
        clearPage();
        renderStartPage();
    };
    reader.readAsText(file);
}

function createItemData(label) {
    const listData = getCurrentList();
    const itemData = {
        index: generateIndex(listData.items),
        label,
        completed: false
    }
    return itemData;
}

function saveList(listData) {
    loadState();
    const index = state.lists.findIndex((list) => list.index === listData.index);
    state.lists[index] = listData;
    saveState();
}

function clearPage() {
    document.body.replaceChildren();
}