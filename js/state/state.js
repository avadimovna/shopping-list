import { saveState, loadState } from "../utils/storage.js";
import { generateIndex } from "../utils/utils.js";

export const state = {
    lists: [],
    currentListId: null,
    editMode: false
};

export function getCurrentList() {
    return state.lists.find(list => list.index === state.currentListId);
}

export function createListData(name) {
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

export function createItemData(label) {
    const listData = getCurrentList();
    const itemData = {
        index: generateIndex(listData.items),
        label,
        completed: false
    }
    return itemData;
}

export function saveList(listData) {
    loadState();
    const index = state.lists.findIndex((list) => list.index === listData.index);
    state.lists[index] = listData;
    saveState();
}

export function createDataString() {
    const listData = getCurrentList();
    const exportData = {
        version: 1,
        type: 'shopping-list',
        data: listData
    }
    return JSON.stringify(exportData);
}