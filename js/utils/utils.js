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

