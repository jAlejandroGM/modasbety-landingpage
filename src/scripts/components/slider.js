export function initSlider() {
  const grid = document.getElementById("servicios-grid");
  const cards = grid.querySelectorAll("#servicios-card");

  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    grid.appendChild(clone);
  });
}
