document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const errorMessage = document.getElementById('errorMessage');
    const gallery = document.getElementById('gallery');

    const modal = document.createElement('div');
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <button class="modal-prev">&#10094;</button>
            <img class="modal-image" src="" alt="">
            <button class="modal-next">&#10095;</button>
        </div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('.modal-image');
    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');

    const regex = /^[\wа-яА-ЯёЁ0-9 !$&*\-=^`|~#%' +/?_{}]{2,30}$/i;
    const UNSPLASH_ACCESS_KEY = '4BhH6aovDpv84FFGv_p1vREzcXmcZQf3zRkCy2s9Ovs';
    const API_URL = 'https://api.unsplash.com/search/photos';

    let currentQuery = 'природа';
    let currentPage = 1;
    const perPage = 30;
    let isLoading = false;
    let imagesList = [];
    let currentIndex = 0;

    async function fetchImages(query, page = 1) {
        isLoading = true;
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
        } catch (error) {
            gallery.innerHTML += `<p class="error-message">Ошибка загрузки: ${error.message}</p>`;
        } finally {
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
            return;
        }

        errorMessage.textContent = '';
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

        currentIndex = parseInt(card.dataset.index);
        showModal(currentIndex);
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    modalNext.addEventListener('click', showNext);
    modalPrev.addEventListener('click', showPrev);

    function showModal(index) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        modalImg.src = imagesList[index].urls.regular;
        modalImg.alt = imagesList[index].alt_description || '';
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        modalImg.src = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % imagesList.length;
        showModal(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
        showModal(currentIndex);
    }

    fetchImages(currentQuery, currentPage);
});
