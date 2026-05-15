export function createSearchModal(listContainer, itemsContainer) {
    let currentIndex = 0;
    let allHighlights = [];
    const modal = document.createElement('div');
    modal.classList.add('find-items-modal')

     function positionModal() {
        const vv = window.visualViewport;
        if (!vv) return;
        modal.style.top = (vv.offsetTop + vv.height - modal.offsetHeight) + 'px';
        modal.style.left = vv.offsetLeft + 'px';
        modal.style.width = vv.width + 'px';
    }

    const input = document.createElement('input');
    input.classList.add('find-items-modal__input');
    input.type = 'text';
    input.addEventListener('input', () => {
        revertOriginalSpan(itemsContainer);
        allHighlights = [];
        currentIndex = 0;
        prevButton.classList.add('disabled');
        nextButton.classList.add('disabled');
        if (input.value.trim().length > 0) {
            allHighlights = searchItems(input.value.trim(), itemsContainer);
            if (allHighlights.length > 0) {
                prevButton.classList.remove('disabled');
                nextButton.classList.remove('disabled');
            } else {
                prevButton.classList.add('disabled');
                nextButton.classList.add('disabled');
            }
        }
    })
    const prevButton = document.createElement('button');
    prevButton.classList.add('find-items-modal__prev-button');
    prevButton.classList.add('disabled');
    prevButton.addEventListener('click', () => {
        if (allHighlights.length > 0) {
            currentIndex = navigateToMatch(allHighlights, currentIndex, 'prev');
        }
    });
    const nextButton = document.createElement('button');
    nextButton.classList.add('find-items-modal__next-button');
    nextButton.classList.add('disabled');
    nextButton.addEventListener('click', () => {
        if (allHighlights.length > 0) {
            currentIndex = navigateToMatch(allHighlights, currentIndex, 'next');
        }
    });
    function closeModal() {
        modal.remove();
        listContainer.style.marginBottom = '';
        revertOriginalSpan(itemsContainer);
    }
    const closeButton = document.createElement('button');
    closeButton.classList.add('find-items-modal__close-button');
    closeButton.addEventListener('click', () => closeModal())
    modal.append(input, prevButton, nextButton, closeButton);
    document.body.appendChild(modal);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', positionModal);
        window.visualViewport.addEventListener('scroll', positionModal);
    }

    requestAnimationFrame(positionModal);

    const modalHeight = modal.getBoundingClientRect().height;
    listContainer.style.marginBottom = modalHeight + 'px';
    input.focus();
    document.addEventListener('click', (event) => {
        if (!document.body.contains(modal)) return;
        if (!modal.contains(event.target) && !itemsContainer.contains(event.target)) {
            closeModal();
        }
    }, { capture: true });
}

function searchItems(string, itemsContainer) {
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function highlightText(text, string) {
        const lowerText = text.toLowerCase();
        const lowerString = string.toLowerCase();
        let result = '';
        let lastIndex = 0;
        let index = lowerText.indexOf(lowerString);

        while (index != -1) {
            const before = text.slice(lastIndex, index);
            const match = text.slice(index, index + string.length);
            result += escapeHtml(before) + `<span class="search-highlight">${escapeHtml(match)}</span>`;
            lastIndex = index + string.length;
            index = lowerText.indexOf(lowerString, lastIndex);
        }

        result += escapeHtml(text.slice(lastIndex));
        return result;
    }
    const items = Array.from(itemsContainer.querySelectorAll('.list-item'));
    const matches = items.filter(item => item.textContent.toLowerCase().includes(string.toLowerCase()));
    matches.forEach(item => {
        const span = item.querySelector('span.list-item__title')
        const text = span.textContent;
        span.dataset.original = text;
        span.innerHTML = highlightText(text, string);
    });
    const allHighlights = Array.from(itemsContainer.querySelectorAll('.search-highlight'));
    if (allHighlights.length > 0) {
        allHighlights[0].classList.add('search-highlight--current');
        allHighlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return allHighlights;
}

function revertOriginalSpan(itemsContainer) {
    const items = Array.from(itemsContainer.querySelectorAll('.list-item'));
    items.forEach((item) => {
        const span = item.querySelector('span.list-item__title');
        if(span.dataset.original) {
            span.textContent = span.dataset.original;
            delete span.dataset.original;
        }
    })
}

function navigateToMatch(highlights, currentIndex, direction) {
    highlights[currentIndex].classList.remove('search-highlight--current');
    if (direction === 'next') {
        currentIndex = currentIndex === highlights.length - 1 ? 0 : currentIndex + 1;
    } else {
        currentIndex = currentIndex === 0 ? highlights.length - 1 : currentIndex - 1;
    }
    highlights[currentIndex].classList.add('search-highlight--current');
    highlights[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    return currentIndex;
}