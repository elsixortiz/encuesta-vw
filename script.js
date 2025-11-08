// 🔗 URL de tu Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEYkpjiQt-Gd76Sve9oZPzc74bVCTwsYM4vCsRG7P8pG6Bhase35rGCGohKQQkk9GM/exec";

// Preguntas de satisfacción (5)
const preguntasSatisfaccion = [
  "¿Qué te pareció la organización del Summit de Usados 2025?",
  "¿Cómo calificarías la calidad del contenido del Summit de Usados 2025?",
  "¿Cómo te pareció la selección de ponentes para este Summit de Usados 2025?",
  "¿Cómo calificarías las dinámicas de las premiaciones?",
  "¿Qué te pareció la selección de hotel y los alimentos?"
];

// Niveles de evaluación (5 caritas)
const niveles = [
  { valor: "muy-malo", imagen: "cara-muy-malo.png", etiqueta: "Muy Malo" },
  { valor: "malo", imagen: "cara-malo.png", etiqueta: "Malo" },
  { valor: "regular", imagen: "cara-regular.png", etiqueta: "Regular" },
  { valor: "bueno", imagen: "cara-bueno.png", etiqueta: "Bueno" },
  { valor: "muy-bueno", imagen: "cara-muy-bueno.png", etiqueta: "Muy Bueno" }
];

let indicePregunta = 0;

document.addEventListener("DOMContentLoaded", () => {
  const preguntaTexto = document.getElementById("pregunta-texto");
  const caritasContainer = document.getElementById("caritas-container");
  const panelPreguntas = document.getElementById("panel-preguntas");
  const panelComentarios = document.getElementById("panel-comentarios");
  const mensajeFinal = document.getElementById("mensaje-final");
  const comentariosInput = document.getElementById("comentarios-input");
  const enviarComentariosBtn = document.getElementById("enviar-comentarios");

  // ✅ Generar botones de caritas (con rutas relativas simples)
  niveles.forEach(nivel => {
    const boton = document.createElement("button");
    boton.className = "cara-btn";
    boton.dataset.value = nivel.valor;
    boton.innerHTML = `<img src="assets/${nivel.imagen}" alt="${nivel.etiqueta}" />`;
    caritasContainer.appendChild(boton);
  });

  // Mostrar primera pregunta
  mostrarPregunta();

  // Forzar visibilidad correcta al inicio
  panelComentarios.style.display = "none";
  mensajeFinal.style.display = "none";
  panelPreguntas.style.display = "block";

  // Eventos para caritas
  caritasContainer.addEventListener("click", (e) => {
    if (e.target.closest(".cara-btn")) {
      const boton = e.target.closest(".cara-btn");
      const respuesta = boton.dataset.value;

      // Enviar en segundo plano (sin await)
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `pregunta=${encodeURIComponent(preguntasSatisfaccion[indicePregunta])}&respuesta=${encodeURIComponent(respuesta)}&dispositivo=tablet`
      }).catch(() => {});

      // Avanzar
      indicePregunta++;
      if (indicePregunta < preguntasSatisfaccion.length) {
        mostrarPregunta();
      } else {
        panelPreguntas.style.display = "none";
        panelComentarios.style.display = "block";
        comentariosInput.focus();
      }
    }
  });

  // Enviar comentarios
  enviarComentariosBtn.addEventListener("click", () => {
    const comentarios = comentariosInput.value.trim();

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `pregunta=${encodeURIComponent("Comentarios del cliente")}&respuesta=${encodeURIComponent(comentarios)}&dispositivo=tablet`
    }).catch(() => {});

    // Mostrar mensaje final
    panelComentarios.style.display = "none";
    mensajeFinal.style.display = "flex";

    // Reiniciar
    setTimeout(() => {
      indicePregunta = 0;
      comentariosInput.value = "";
      mensajeFinal.style.display = "none";
      panelPreguntas.style.display = "block";
      mostrarPregunta();
    }, 3000);
  });

  function mostrarPregunta() {
    preguntaTexto.textContent = preguntasSatisfaccion[indicePregunta];
  }
});
