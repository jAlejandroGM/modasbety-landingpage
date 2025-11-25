// copyBtn.js
// Proporciona una función global `copyNum(btn)` que copia un número de teléfono
// y muestra retroalimentación visual (icono y texto) de forma sencilla.

export function initCopyBtn() {
  (function () {
    const PHONE_NUMBER = "947620202";
    const SUCCESS_TEXT = "¡Copiado!";
    const SUCCESS_MS = 6000; // tiempo en ms que dura el estado de "copiado"

    // Oculta los iconos de check al inicio (si no lo hace el CSS)
    function init() {
      const checks = document.querySelectorAll(".check-icon");
      checks.forEach((el) => (el.style.display = "none"));
    }

    // Fallback para navegadores antiguos usando textarea
    function fallbackCopy(text) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch (e) {}
      document.body.removeChild(ta);
    }

    // Muestra el icono de check y cambia el texto del botón; luego revierte
    function showSuccessUI(btn) {
      const copyIcon = btn.querySelector(".copy-icon");
      const checkIcon = btn.querySelector(".check-icon");
      const textEl = btn.querySelector(".text-sm");

      const originalText = textEl ? textEl.textContent : "";

      if (copyIcon) copyIcon.style.display = "none";
      if (checkIcon) checkIcon.style.display = "inline-block";
      if (textEl) textEl.textContent = SUCCESS_TEXT;

      setTimeout(() => {
        if (copyIcon) copyIcon.style.display = "";
        if (checkIcon) checkIcon.style.display = "none";
        if (textEl) textEl.textContent = originalText;
      }, SUCCESS_MS);
    }

    // Función global usada por el onclick del botón: copyNum(this)
    window.copyNum = function (btn) {
      if (!btn) btn = document.body;

      // Intentar la API moderna primero
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(PHONE_NUMBER)
          .then(() => showSuccessUI(btn))
          .catch(() => {
            fallbackCopy(PHONE_NUMBER);
            showSuccessUI(btn);
          });
      } else {
        // fallback
        fallbackCopy(PHONE_NUMBER);
        showSuccessUI(btn);
      }
    };

    // Inicializar cuando el DOM esté listo. El script normalmente se carga con `defer`.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
}
