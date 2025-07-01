import { setupModal } from './modal.js';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const API_URL = 'https://api.unsplash.com/search/photos';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const errorMessage = document.getElementById('errorMessage');
    const gallery = document.getElementById('gallery');
    const regex = /^[\wа-яА-ЯёЁ0-9 !$&*\-=^`|~#%' +/?_{}]{2,30}$/i;
    const loader = document.getElementById('loader');


    let currentQuery = 'природа';
    let currentPage = 1;
    const perPage = 30;
    let isLoading = false;
    let imagesList = [];

    const modal = setupModal();

    async function fetchImages(query, page = 1) {
        isLoading = true;
        loader.classList.remove('hidden');

        try {
            const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=squarish`, {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            });

            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

            const data = await response.json();
            if (page === 1) {
                gallery.innerHTML = '';
                imagesList = [];
            }

            imagesList.push(...data.results);
            renderImages(data.results);
            modal.setImages(imagesList);
        } catch (error) {
            gallery.innerHTML += `<p class="error-message">Ошибка загрузки: ${error.message}</p>`;
        } finally {
            loader.classList.add('hidden');
            isLoading = false;
        }
    }

    function renderImages(images) {
        if (!images.length && currentPage === 1) {
            gallery.innerHTML = '<p>Ничего не найдено по запросу.</p>';
            return;
        }

        const markup = images
            .map((img, index) => `
                <div class="card" data-index="${imagesList.length - images.length + index}">
                    <img src="${img.urls.small}" alt="${img.alt_description || 'Image'}" />
                </div>
            `)
            .join('');

        gallery.insertAdjacentHTML('beforeend', markup);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawValue = input.value.trim();

        if (!regex.test(rawValue)) {
            errorMessage.textContent = 'Введите от 2 до 30 допустимых символов.';
            errorMessage.classList.add('visible');
            return;
        }

        errorMessage.textContent = '';
        errorMessage.classList.remove('visible');
        currentQuery = rawValue;
        currentPage = 1;
        fetchImages(currentQuery, currentPage);
    });

    window.addEventListener('scroll', () => {
        const scrollPos = window.innerHeight + window.scrollY;
        const bottom = document.body.offsetHeight - 100;

        if (scrollPos >= bottom && !isLoading) {
            currentPage++;
            fetchImages(currentQuery, currentPage);
        }
    });

    gallery.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;

        const index = parseInt(card.dataset.index);
        modal.open(index);
    });

    fetchImages(currentQuery, currentPage);
});
