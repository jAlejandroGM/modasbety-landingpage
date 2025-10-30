// Efecto de pétalos de sakura cayendo
// Objetivo: mantener el canvas en position:absolute (para que acompañe el scroll)
// y hacer que ocupe el 100% del alto de la página (no sólo el viewport).
// Puntos clave de esta implementación:
// - El tamaño visual del canvas se controla por CSS + JS sólo para la altura total de la página.
// - El bitmap interno del canvas se escala por DPR para verse nítido en pantallas Retina.
// - Toda la lógica (límites, limpieza, respawns) usa las dimensiones reales del canvas, NO window.
// - Observamos cambios de tamaño de ventana y del body para ajustar la altura cuando cambie el contenido.

const canvas = document.getElementById("sakura-canvas");

if (!canvas) {
  console.error("No se encontró el elemento #sakura-canvas");
} else {
  const ctx = canvas.getContext("2d");
  let dpr = window.devicePixelRatio || 1;

  // Devuelve el alto total de la página, considerando distintos motores/navegadores.
  function getPageHeight() {
    const { body, documentElement: doc } = document;
    return Math.max(
      body.scrollHeight,
      doc.scrollHeight,
      body.offsetHeight,
      doc.offsetHeight,
      body.clientHeight,
      doc.clientHeight
    );
  }

  // Ajusta el bitmap del canvas para que cubra el ancho disponible y TODO el alto de la página.
  function resizeCanvas() {
    // Alto total de la página en px CSS (visual)
    const pageHeight = getPageHeight();

    // Ancho visual actual del canvas (normalmente w-full por CSS); fallback al ancho del viewport
    const cssWidth = canvas.clientWidth || document.documentElement.clientWidth;
    const cssHeight = pageHeight; // queremos cubrir toda la página completa

    // Aseguramos la altura visual por estilo directo (absolute no "estira" más allá del viewport sin un valor)
    canvas.style.height = cssHeight + "px";
    // El ancho visual preferimos que lo gobierne CSS (w-full); no lo forzamos aquí.

    // Relee DPR por si cambió (p. ej., mover ventana entre pantallas)
    dpr = window.devicePixelRatio || 1;

    // Tamaño real del bitmap interno del canvas
    const targetW = Math.round(cssWidth * dpr);
    const targetH = Math.round(cssHeight * dpr);
    if (canvas.width !== targetW) canvas.width = targetW;
    if (canvas.height !== targetH) canvas.height = targetH;

    // Escalar el contexto para dibujar en coordenadas de px CSS
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Redimensionar ante cambios de ventana
  window.addEventListener("resize", resizeCanvas);

  // Observar cambios del contenido que afecten la altura total de la página
  const bodyResizeObserver = new ResizeObserver(() => resizeCanvas());
  bodyResizeObserver.observe(document.body);

  // Llamada inicial
  resizeCanvas();

  // Configuración de animación
  const maxPetals = 120; // subir con precaución si la página es muy larga
  const petals = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  const sakuraImage = new Image();
  // Ubicada en /public/images/...
  sakuraImage.src = "/images/flor-de-sakura.png";

  // Representa un pétalo individual con posición, movimiento y renderizado
  class Petal {
    constructor(width, height) {
      this.reset(width, height);
    }

    // Coloca el pétalo por arriba del área visible total y configura sus parámetros aleatorios
    reset(width, height) {
      this.x = random(-100, width + 100);
      this.y = random(-height * 0.5, -100);
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

    // Avanza la simulación y recicla el pétalo si sale de los límites del canvas
    update(width, height) {
      this.y += this.speedY;
      this.x += this.speedX;

      this.swayOffset += this.swaySpeed;
      this.x += Math.sin(this.swayOffset) * this.swayAmount;

      this.rotation += this.rotationSpeed;

      if (this.y > height + 100 || this.x < -200 || this.x > width + 200) {
        this.reset(width, height);
      }
    }

    // Dibuja el pétalo en el contexto 2D (usa px CSS gracias al setTransform)
    draw(ctx) {
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

  // Bucle de animación principal
  function animate() {
    // Dimensiones actuales del canvas en px CSS
    const width = canvas.clientWidth || document.documentElement.clientWidth;
    const height = canvas.clientHeight || getPageHeight();

    // Limpieza completa del canvas (simple y sin artefactos al volver a zonas ya dibujadas)
    // Nota: En páginas extremadamente largas, esto puede ser costoso. Si hiciera falta,
    // se puede optimizar limpiando y dibujando sólo la ventana visible (scrollY..scrollY+innerHeight).
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.update(width, height);
      p.draw(ctx);
    }

    requestAnimationFrame(animate);
  }

  // Cargar imagen y lanzar la simulación
  sakuraImage.onload = () => {
    const width = canvas.clientWidth || document.documentElement.clientWidth;
    const height = canvas.clientHeight || getPageHeight();

    petals.length = 0;
    for (let i = 0; i < maxPetals; i++) {
      petals.push(new Petal(width, height));
    }
    animate();
  };

  sakuraImage.onerror = () => {
    console.error("Error cargando imagen de sakura:", sakuraImage.src);
  };
}
