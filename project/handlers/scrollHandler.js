import { loadAndRenderImages } from './searchHandler.js';

export function handleScroll(state, gallery, loader, modal) {
    const scrollPos = window.innerHeight + window.scrollY;
    const bottom = document.body.offsetHeight - 100;

    if (scrollPos >= bottom && !state.isLoading) {
        state.currentPage++;
        loadAndRenderImages(state, gallery, loader, modal);
    }
}
