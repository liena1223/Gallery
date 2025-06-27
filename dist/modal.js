export function setupModal() {
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

    let images = [];
    let index = 0;

    function showModal(i) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        modalImg.src = images[i].urls.regular;
        modalImg.alt = images[i].alt_description || '';
        index = i;
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        modalImg.src = '';
    }

    function showNext() {
        index = (index + 1) % images.length;
        showModal(index);
    }

    function showPrev() {
        index = (index - 1 + images.length) % images.length;
        showModal(index);
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    modalNext.addEventListener('click', showNext);
    modalPrev.addEventListener('click', showPrev);

    return {
        setImages(imgArray) {
            images = imgArray;
        },
        open(i) {
            showModal(i);
        }
    };
}