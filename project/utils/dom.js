export function renderError(message, gallery) {
    const p = document.createElement('p');
    p.className = 'error-message';
    p.textContent = message;
    gallery.appendChild(p);
}

export function renderImages(images, state, gallery) {
    if (!images.length && state.currentPage === 1) {
        gallery.textContent = 'Nothing found for your request.';
        return;
    }

    const fragment = document.createDocumentFragment();

    images.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.index = state.images.length - images.length + index;

        const image = document.createElement('img');
        image.src = img.urls.small;
        image.alt = img.alt_description || 'Image';

        div.appendChild(image);
        fragment.appendChild(div);
    });

    gallery.appendChild(fragment);
}


