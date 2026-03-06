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
    list.addEventListener('click', () => openList(listData));
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

