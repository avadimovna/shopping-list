import { state } from "../state/state.js";

export function loadState() {
    state.lists = JSON.parse(localStorage.getItem('lists')) || [];
}

export function saveState() {
    localStorage.setItem('lists', JSON.stringify(state.lists));
}