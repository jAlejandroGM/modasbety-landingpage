// Efecto de pétalos de sakura cayendo
// Objetivo: mantener el canvas en position:absolute (para que acompañe el scroll)
// y hacer que ocupe el 100% del alto de la página (no sólo el viewport).
// Puntos clave de esta implementación:
// - El tamaño visual del canvas se controla por CSS + JS sólo para la altura total de la página.
// - El bitmap interno del canvas se escala por DPR para verse nítido en pantallas Retina.
// - Toda la lógica (límites, limpieza, respawns) usa las dimensiones reales del canvas, NO window.
// - Observamos cambios de tamaño de ventana y del body para ajustar la altura cuando cambie el contenido.
// - Robustez extra: respetamos prefers-reduced-motion, pausamos al cambiar de pestaña,
//   limitamos el DPR para evitar bitmaps gigantes, y recalculamos densidad según altura total.

const canvas = document.getElementById("sakura-canvas");

if (!canvas) {
  console.error("No se encontró el elemento #sakura-canvas");
} else {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Contexto 2D no disponible para #sakura-canvas");
  } else {
    // Limitar DPR para evitar bitmaps enormes en pantallas muy densas (ahorra memoria/CPU)
    let dpr = Math.min(2, window.devicePixelRatio || 1);

    // Respeto de accesibilidad: si el usuario prefiere menos movimiento, no animamos
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

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
      const cssWidth =
        canvas.clientWidth || document.documentElement.clientWidth;
      const cssHeight = pageHeight; // queremos cubrir toda la página completa

      // Aseguramos la altura visual por estilo directo (absolute no "estira" más allá del viewport sin un valor)
      canvas.style.height = cssHeight + "px";
      // El ancho visual preferimos que lo gobierne CSS (w-full); no lo forzamos aquí.

      // Relee DPR por si cambió (p. ej., mover ventana entre pantallas) y cap a 2x
      dpr = Math.min(2, window.devicePixelRatio || 1);

      // Tamaño real del bitmap interno del canvas
      const targetW = Math.round(cssWidth * dpr);
      const targetH = Math.round(cssHeight * dpr);
      if (canvas.width !== targetW) canvas.width = targetW;
      if (canvas.height !== targetH) canvas.height = targetH;

      // Escalar el contexto para dibujar en coordenadas de px CSS
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Redimensionar ante cambios de ventana (throttle por rAF)
    let resizeRaf = null;
    window.addEventListener(
      "resize",
      () => {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(resizeCanvas);
      },
      { passive: true }
    );

    // Observar cambios del contenido que afecten la altura total de la página
    const bodyResizeObserver = new ResizeObserver(() => resizeCanvas());
    bodyResizeObserver.observe(document.body);

    // Llamada inicial
    resizeCanvas();

    // Densidad adaptativa: escala la cantidad de pétalos según la altura total de la página
    function computeMaxPetals() {
      const vh = window.innerHeight || 800;
      const pageH = getPageHeight();
      const scale = Math.min(3, Math.max(1, Math.ceil(pageH / vh))); // 1x..3x
      return Math.min(120, 60 * scale); // base 60, máx 120
    }

    let maxPetals = computeMaxPetals();
    let petals = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    const sakuraImage = new Image();
    // Ubicada en /public/images/... (ruta estable en Astro al estar en public/)
    sakuraImage.src = "/images/flor-de-sakura.webp";

    // Dibujo acelerado opcional: intentar crear un ImageBitmap después de decodificar
    // el HTMLImageElement. Esto evita trabajo de decodificación síncrono en el
    // primer draw y puede reducir el "jank" del primer fotograma. Si
    // createImageBitmap no está disponible o falla, volvemos a dibujar con el
    // HTMLImageElement.
    let sakuraBitmap = null;

    async function prepareImageAndStart() {
      try {
        // Preferir esperar a decode() (promesa no bloqueante) para que el
        // navegador realice el trabajo pesado antes del primer draw.
        if (typeof sakuraImage.decode === "function") {
          await sakuraImage.decode();
        } else {
          await new Promise((resolve, reject) => {
            sakuraImage.onload = resolve;
            sakuraImage.onerror = () =>
              reject(new Error("sakura image failed to load"));
          });
        }

        // Intentar crear un ImageBitmap para dibujar más rápido en algunos
        // navegadores.
        if (typeof createImageBitmap === "function") {
          try {
            sakuraBitmap = await createImageBitmap(sakuraImage);
          } catch (err) {
            // Si falla, seguir usando el HTMLImageElement. No es fatal.
            sakuraBitmap = null;
            console.warn("createImageBitmap falló, volviendo a Image:", err);
          }
        }
      } catch (err) {
        // La decodificación o carga puede fallar; registrar y continuar para no
        // bloquear la experiencia de usuario.
        console.warn(
          "La decodificación/carga de la imagen falló; la animación intentará iniciarse de todos modos:",
          err
        );
      } finally {
        // Respetar preferencia de movimiento reducido; no iniciar si el usuario
        // optó por reducir el movimiento.
        if (prefersReducedMotion.matches) return;
        initParticles();
        play();
      }
    }
    // Iniciar la preparación en segundo plano (el rel="preload" en head
    // acelera la descarga de la imagen).
    prepareImageAndStart();

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

        // Use the ImageBitmap if available (faster on some platforms). Fallback
        // to the HTMLImageElement when bitmap isn't available.
        const img = sakuraBitmap || sakuraImage;
        ctx.drawImage(
          img,
          -this.size / 2,
          -this.size / 2,
          this.size,
          this.size
        );

        ctx.restore();
      }
    }

    // Bucle de animación principal
    let rafId = null; // id del requestAnimationFrame activo (si lo hay)
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

      rafId = requestAnimationFrame(animate);
    }

    // Control de reproducción/pausa del bucle
    function play() {
      if (rafId == null) {
        rafId = requestAnimationFrame(animate);
      }
    }
    function pause() {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // Inicializa el conjunto de partículas con densidad actual
    function initParticles() {
      const width = canvas.clientWidth || document.documentElement.clientWidth;
      const height = canvas.clientHeight || getPageHeight();

      maxPetals = computeMaxPetals();
      petals = [];
      for (let i = 0; i < maxPetals; i++) {
        petals.push(new Petal(width, height));
      }
    }

    // Pausa cuando la pestaña no está visible (ahorra CPU/batería)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
      else play();
    });

    // Reaccionar a cambios de preferencia de movimiento del usuario
    prefersReducedMotion.addEventListener?.("change", (e) => {
      if (e.matches) {
        // Usuario ahora prefiere menos movimiento: detener y limpiar
        pause();
        petals = [];
        ctx.clearRect(0, 0, canvas.clientWidth || 0, canvas.clientHeight || 0);
      } else {
        // Se reactivaron animaciones: reiniciar
        initParticles();
        play();
      }
    });

    // Cargar imagen: startup is handled by prepareImageAndStart(); log errors here.
    sakuraImage.onerror = () => {
      console.error("Error cargando imagen de sakura:", sakuraImage.src);
    };

    // Recalcular densidad si cambia significativamente la altura del documento
    const recalcDensity = () => {
      const newMax = computeMaxPetals();
      if (newMax !== maxPetals) {
        initParticles();
      }
    };
    const densityObserver = new ResizeObserver(recalcDensity);
    densityObserver.observe(document.body);

    // Limpieza al salir de la página (buena práctica en SPAs o navegaciones parciales)
    window.addEventListener("beforeunload", () => {
      bodyResizeObserver.disconnect();
      densityObserver.disconnect();
      pause();
    });
  }
}
