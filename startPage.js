function getLists() {
    return JSON.parse(localStorage.getItem('lists')) || [];
}

function createStartPage() {
    const startPage = document.createElement('div');
    startPage.classList.add('start-page');
    const title = document.createElement('h2');
    title.classList.add('start-page__title');
    title.textContent = 'My lists';
    startPage.appendChild(title);
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
        const listContent = createListContent();
        listData.items.forEach((item) => {
            const listItem = createListItem(item, listData);
            if (item.completed) {
                listItem.classList.add('list-page__list-item--completed');
            }
            listContent.append(listItem);
        })
        const listPage = createListPage(listData, listContent);
        listPage.appendChild(listContent);
        document.body.appendChild(listPage);
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('list-field__button-delete');
    deleteBtn.addEventListener('click', () => {
        listField.remove();
        let lists = getLists();
        lists = lists.filter((item) => item.index !== listData.index);
        localStorage.setItem('lists', JSON.stringify(lists));
    })
    listField.append(list, deleteBtn);
    return listField;
}

function createListData(name) {
    let lists = getLists();
    const listData = {
        index: generateIndex(lists),
        name,
        items: []
    };
    lists.push(listData);
    localStorage.setItem('lists', JSON.stringify(lists));
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
    const startpage = createStartPage();
    const listsArea = createListsArea();
    let lists = getLists();
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

function createListPage(listData, listContent) {
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
        const addListItemBtn = createAddListItemButton(listContent, listData);

        doneBtn.addEventListener('click', () => {
            const newName = input.value.trim();
            title.textContent = newName
            input.remove();
            doneBtn.remove();
            addListItemBtn.remove();
            title.classList.remove('hidden');
            editBtn.classList.remove('hidden');
            backBtn.classList.remove('hidden');
            listData.name = newName;
            let lists = getLists();
            let index = lists.findIndex((item) => item.index === listData.index);
            lists[index].name = newName;
            localStorage.setItem('lists', JSON.stringify(lists));
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
        listContent.prepend(addListItemBtn);
        titleField.prepend(input);
        titleField.prepend(doneBtn);
    })
    const moreBtn = document.createElement('button');
    moreBtn.classList.add('list-page__button-more');
    titleField.append(backBtn, title, editBtn, moreBtn);
    listPage.appendChild(titleField);
    return listPage;
}

function createListContent() {
    const listContainer = document.createElement('div');
    listContainer.classList.add('list-page__container');
    return listContainer;
}

function createAddListItemButton(listContent, listData) {
    const addListItemBtn = document.createElement('button');
    addListItemBtn.classList.add('list-page__button-add-item');
    addListItemBtn.textContent = 'Add item';
    addListItemBtn.addEventListener('click', () => {
        const { backdrop, input } = createListItemModal(listContent, listData);
        document.body.append(backdrop);
        input.focus();
    })
    return addListItemBtn;
}

function createListItemModal(listContent, listData) {
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
    nextBtn.textContent = "Next";
    nextBtn.addEventListener('click', () => {
        const itemData = createItemData(input.value.trim(), listData);
        listData.items.push(itemData);
        console.log(itemData);
        saveList(listData);
        const listItem = createListItem(itemData, listData);
        listContent.append(listItem);
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
    okBtn.textContent = "OK";
    okBtn.addEventListener('click', () => {
        const itemData = createItemData(input.value.trim(), listData);
        listData.items.push(itemData);
        saveList(listData);
        const listItem = createListItem(itemData, listData);
        listContent.append(listItem);
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

function createListItem(itemData, listData) {
    const listItem = document.createElement('div');
    listItem.classList.add('list-page__list-item');
    listItem.textContent = itemData.label;
    listItem.addEventListener('click' , () => {
        listItem.classList.toggle('list-page__list-item--completed');
        itemData.completed = !itemData.completed;
        saveList(listData);
    });
    return listItem;
}

function createItemData(label, listData) {
    const itemData = {
        index: generateIndex(listData.items),
        label,
        completed: false
    }
    return itemData;
}

function saveList(listData) {
    const lists = getLists();
    const index = lists.findIndex((list) => list.index === listData.index);
    lists[index] = listData;
    localStorage.setItem('lists', JSON.stringify(lists));
}

function clearPage() {
    document.body.replaceChildren();
}