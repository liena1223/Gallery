import { setupModal } from './modal.js';
import { DEFAULT_QUERY } from './constants.js';
import { handleSearchSubmit, loadAndRenderImages } from './handlers/searchHandler.js';
import { handleScroll } from './handlers/scrollHandler.js';
import { handleCardClick } from './handlers/cardClickHandler.js';

const form = document.querySelector('.search-form');
const input = document.querySelector('.js-search-input');
const errorMessage = document.querySelector('.js-error-message');
const gallery = document.querySelector('.js-gallery');
const loader = document.querySelector('.js-loader');

if (!form || !input || !errorMessage || !gallery || !loader) {
    throw new Error('Missing essential DOM elements');
}

const state = {
    currentQuery: DEFAULT_QUERY,
    currentPage: 1,
    isLoading: false,
    images: [],
    currentIndex: 0,
};

const modal = setupModal(state);

function initialLoad() {
    loadAndRenderImages(state, gallery, loader, modal);
}

function initGalleryApp() {
    form.addEventListener('submit', (e) =>
        handleSearchSubmit(e, state, input, errorMessage, gallery, loader, modal)
    );

    window.addEventListener('scroll', () =>
        handleScroll(state, gallery, loader, modal)
    );

    gallery.addEventListener('click', (e) =>
        handleCardClick(e, modal)
    );
}

initGalleryApp();
initialLoad();
