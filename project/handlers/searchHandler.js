import { REGEX } from '../constants.js';
import { fetchImages } from '../services/api.js';
import { renderImages, renderError } from '../utils/dom.js';

export async function handleSearchSubmit(e, state, input, errorMessage, gallery, loader, modal) {
    e.preventDefault();
    const rawValue = input.value.trim();

    if (!REGEX.test(rawValue)) {
        errorMessage.textContent = 'Please enter between 2 and 30 valid characters.';
        errorMessage.classList.add('visible');
        return;
    }

    errorMessage.textContent = '';
    errorMessage.classList.remove('visible');

    state.currentQuery = rawValue;
    state.currentPage = 1;

    await loadAndRenderImages(state, gallery, loader, modal);
}


export async function loadAndRenderImages(state, gallery, loader, modal) {
    state.isLoading = true;
    loader.classList.remove('hidden');

    try {
        const images = await fetchImages(state.currentQuery, state.currentPage);

        if (state.currentPage === 1) {
            gallery.innerHTML = '';
            state.images = [];
        }

        state.images = [...state.images, ...images];
        renderImages(images, state, gallery);
        modal.setImages(state.images);

    } catch (error) {
        renderError(`Loading error: ${error.message}`, gallery);
    } finally {
        loader.classList.add('hidden');
        state.isLoading = false;
    }
}
