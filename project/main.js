import { setupModal } from './modal.js';
import { API_URL, UNSPLASH_ACCESS_KEY, REGEX, DEFAULT_QUERY, PER_PAGE } from './constants.js';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const errorMessage = document.querySelector('.error-message');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

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

function renderError(message) {
    const p = document.createElement('p');
    p.className = 'error-message';
    p.textContent = message;
    gallery.appendChild(p);
}

function renderImages(images) {
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

async function fetchImages(query, page = 1) {
    state.isLoading = true;
    loader.classList.remove('hidden');

    try {
        const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}&page=${page}&per_page=${PER_PAGE}&orientation=squarish`, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        if (!data?.results) throw new Error('Incorrect response from API');

        if (page === 1) {
            gallery.innerHTML = '';
            state.images = [];
        }

        state.images = [...state.images, ...data.results];
        renderImages(data.results);
        modal.setImages(state.images);

    } catch (error) {
        renderError(`Loading error: ${error.message}`);
    } finally {
        loader.classList.add('hidden');
        state.isLoading = false;
    }
}

function handleSearchSubmit(e) {
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
    fetchImages(state.currentQuery, state.currentPage);
}

function handleScroll() {
    const scrollPos = window.innerHeight + window.scrollY;
    const bottom = document.body.offsetHeight - 100;

    if (scrollPos >= bottom && !state.isLoading) {
        state.currentPage++;
        fetchImages(state.currentQuery, state.currentPage);
    }
}

function handleCardClick(e) {
    const card = e.target.closest('.card');
    if (!card) return;

    const index = parseInt(card.dataset.index);
    if (isNaN(index)) return;

    modal.open(index);
}

function initGalleryApp() {
    form.addEventListener('submit', handleSearchSubmit);
    window.addEventListener('scroll', handleScroll);
    gallery.addEventListener('click', handleCardClick);
    fetchImages(state.currentQuery, state.currentPage);
}

initGalleryApp();
