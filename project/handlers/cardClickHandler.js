export function handleCardClick(e, modal) {
    const card = e.target.closest('.card');
    if (!card) return;

    const index = parseInt(card.dataset.index);
    if (isNaN(index)) return;

    modal.open(index);
}
