// All cards with data-map
const cards = document.querySelectorAll('.card[data-map]');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const closeBtn = document.querySelector('.close-modal');

cards.forEach(card => {
  card.addEventListener('click', () => {
    const mapUrl = card.getAttribute('data-map');
    modalContent.innerHTML = `<iframe src="${mapUrl}" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
    modal.style.display = 'flex';
  });
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', e => {
  if(e.target === modal) modal.style.display = 'none';
});
