// Variable para prevenir clicks múltiples
let isAnimating = false;

// Función para copiar teléfono
function copiarTelefono() {
  // Prevenir clicks múltiples durante la animación
  if (isAnimating) return;
  isAnimating = true;

  const telefono = "+51947620202";
  const button = document.getElementById("copy-button");
  const buttonText = document.querySelector(".button-text");
  const copyIcon = document.getElementById("copy-icon");
  const checkIcon = document.getElementById("check-icon");

  // Cambiar a estado copiado con animación suave
  copyIcon.style.opacity = "0";
  copyIcon.style.transform = "scale(0.8)";

  setTimeout(() => {
    copyIcon.style.display = "none";
    checkIcon.style.display = "block";
    // Cambiar texto DESPUÉS de la animación de salida
    buttonText.textContent = "¡Copiado!";

    // Trigger reflow para que la animación funcione
    checkIcon.offsetHeight;
    checkIcon.style.opacity = "1";
    checkIcon.style.transform = "scale(1)";
  }, 400);

  button.classList.add("copied");

  // Copiar al clipboard con fallback simple
  navigator.clipboard.writeText(telefono).catch(() => {
    // Fallback para navegadores antiguos
    const textArea = document.createElement("textarea");
    textArea.value = telefono;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  });

  setTimeout(restaurarBotonCopiar, 6000);
}

function restaurarBotonCopiar() {
  const button = document.getElementById("copy-button");
  const buttonText = document.querySelector(".button-text");
  const copyIcon = document.getElementById("copy-icon");
  const checkIcon = document.getElementById("check-icon");

  // Primero animar la salida del check
  checkIcon.style.opacity = "0";
  checkIcon.style.transform = "scale(0.8)";

  setTimeout(() => {
    // Cambiar elementos del DOM
    checkIcon.style.display = "none";
    copyIcon.style.display = "block";
    // Cambiar texto DESPUÉS de la animación de salida
    buttonText.textContent = "Copiar número";

    // Trigger reflow para que la animación funcione
    copyIcon.offsetHeight;
    copyIcon.style.opacity = "1";
    copyIcon.style.transform = "scale(1)";
  }, 400);

  button.classList.remove("copied");

  // Permitir clicks nuevamente después de completar la animación
  setTimeout(() => {
    isAnimating = false;
  }, 400);
}

// Solo muestra el mensaje "¡Copiado!" con CSS en el botón de ubicación
function copiarTelefono2(btn) {
  btn.classList.add("copied");
  const telefono = "+51 947 620 202";
  navigator.clipboard.writeText(telefono).catch(() => {
    const textArea = document.createElement("textarea");
    textArea.value = telefono;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  });
  setTimeout(() => {
    btn.classList.remove("copied");
  }, 2000);
}
