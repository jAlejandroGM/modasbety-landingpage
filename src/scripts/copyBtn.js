// copyBtn.js
// Proporciona una función global `copyNum(btn)` que copia un número de teléfono
// y muestra retroalimentación visual (icono y texto) de forma sencilla.

export function initCopyBtn() {
  // Evitar reinicializar si ya existe
  if (window.copyNum) return;

  (function () {
    const SUCCESS_TEXT = "¡Copiado!";
    const SUCCESS_MS = 6000; // tiempo en ms que dura el estado de "copiado"

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

      // Fix: Evitar capturar "¡Copiado!" como texto original si se hace clic rápido
      let originalText = "";
      if (textEl) {
        if (textEl.dataset.originalText) {
          originalText = textEl.dataset.originalText;
        } else {
          originalText = textEl.textContent;
          textEl.dataset.originalText = originalText;
        }
      }

      if (copyIcon) copyIcon.style.display = "none";
      if (checkIcon) checkIcon.style.display = "inline-block";
      if (textEl) textEl.textContent = SUCCESS_TEXT;

      // Limpiar timeout anterior si existe para evitar parpadeos
      if (btn.dataset.timeoutId) {
        clearTimeout(parseInt(btn.dataset.timeoutId));
      }

      const timeoutId = setTimeout(() => {
        if (copyIcon) copyIcon.style.display = "";
        if (checkIcon) checkIcon.style.display = "none";
        if (textEl) textEl.textContent = originalText;
        delete btn.dataset.timeoutId; // Limpiar ID
      }, SUCCESS_MS);

      btn.dataset.timeoutId = timeoutId.toString();
    }

    // Función global usada por el onclick del botón: copyNum(this)
    window.copyNum = function (btn) {
      if (!btn) btn = document.body;

      // Obtener el número del atributo data-phone
      const phoneNumber = btn.dataset.phone || "947620202";

      // Intentar la API moderna primero
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(phoneNumber)
          .then(() => showSuccessUI(btn))
          .catch(() => {
            fallbackCopy(phoneNumber);
            showSuccessUI(btn);
          });
      } else {
        // fallback
        fallbackCopy(phoneNumber);
        showSuccessUI(btn);
      }
    };
  })();
}
