const grid = document.getElementsByClassName("servicios-grid")[0];
const cards = grid.querySelectorAll(".servicio-card");

cards.forEach((card) => {
  const clone = card.cloneNode(true);
  grid.appendChild(clone);
});
