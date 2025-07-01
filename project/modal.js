function showModal(state, modal, modalImg, index) {
    if (!state.images[index]) return;

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');

    modalImg.src = state.images[index].urls.regular;
    modalImg.alt = state.images[index].alt_description || '';

    state.currentIndex = index;
}

function closeModal(modal, modalImg) {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    modalImg.src = '';
}

function showNext(state, modal, modalImg) {
    state.currentIndex = (state.currentIndex + 1) % state.images.length;
    showModal(state, modal, modalImg, state.currentIndex);
}

function showPrev(state, modal, modalImg) {
    state.currentIndex = (state.currentIndex - 1 + state.images.length) % state.images.length;
    showModal(state, modal, modalImg, state.currentIndex);
}

export function setupModal(state) {
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

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeModal(modal, modalImg);
        if (e.key === 'ArrowRight') showNext(state, modal, modalImg);
        if (e.key === 'ArrowLeft') showPrev(state, modal, modalImg);
    });

    modalClose.addEventListener('click', () => closeModal(modal, modalImg));
    modalOverlay.addEventListener('click', () => closeModal(modal, modalImg));
    modalNext.addEventListener('click', () => showNext(state, modal, modalImg));
    modalPrev.addEventListener('click', () => showPrev(state, modal, modalImg));

    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            showNext(state, modal, modalImg);
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            showPrev(state, modal, modalImg);
        }
    }

    return {
        setImages(imgArray) {
            if (!Array.isArray(imgArray)) throw new Error('setImages expects array');
            state.images = imgArray;
        },
        open(i) {
            showModal(state, modal, modalImg, i);
        },
    };
}
