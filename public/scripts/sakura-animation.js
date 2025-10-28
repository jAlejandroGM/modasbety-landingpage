const canvas = document.getElementById("sakura-canvas");
const ctx = canvas.getContext("2d");

// Configuración del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Redimensionar canvas cuando cambie el tamaño de ventana
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const maxPetals = 60;
const petals = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const sakuraImage = new Image();
sakuraImage.src = "assets/images/flor de sakura.png";

class Petal {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(-100, canvas.width + 100);
    this.y = random(-canvas.height * 0.5, -100);
    this.size = random(25, 45);
    this.speedY = random(0.2, 0.6);
    this.speedX = random(-0.1, 0.1);
    this.opacity = random(0.5, 0.9);
    this.rotation = random(0, 2 * Math.PI);
    this.rotationSpeed = random(-0.003, 0.003);

    this.swaySpeed = random(0.005, 0.015);
    this.swayAmount = random(0.2, 0.5);
    this.swayOffset = random(0, Math.PI * 2);
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;

    this.swayOffset += this.swaySpeed;
    this.x += Math.sin(this.swayOffset) * this.swayAmount;

    this.rotation += this.rotationSpeed;

    if (
      this.y > canvas.height + 100 ||
      this.x < -200 ||
      this.x > canvas.width + 200
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.drawImage(
      sakuraImage,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size
    );

    ctx.restore();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  petals.forEach((petal) => {
    petal.update();
    petal.draw();
  });

  requestAnimationFrame(animate);
}

sakuraImage.onload = () => {
  for (let i = 0; i < maxPetals; i++) {
    petals.push(new Petal());
  }
  animate();
};

sakuraImage.onerror = () => {
  console.error("Error cargando imagen de sakura");
};
