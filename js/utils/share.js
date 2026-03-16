import { state, getCurrentList, createDataString } from "../state/state.js";
import { loadState, saveState } from "./storage.js";
import { generateIndex, clearPage } from "./utils.js";
import { renderStartPage } from "../pages/startPage.js";

export function exportList() {
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

export async function shareList() {
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

export function importList(file) {
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