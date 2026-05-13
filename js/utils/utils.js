import { getCurrentList } from "../state/state.js";
import { state } from "../state/state.js";

export function generateIndex(array) {
    let maxId = 0;
    if(array.length > 0) {
        maxId = Math.max(...array.map(item => item.index));
    }
    return maxId + 1;
}

export function clearPage() {
    document.body.replaceChildren();
}

export function toggleFilter() {
    document.body.classList.toggle('filtered');
    state.filterUncopmlete = !state.filterUncopmlete;
    console.log(state);
}
