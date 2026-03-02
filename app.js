const cards = document.querySelectorAll(".card");
const tagline = document.getElementById("tagline");
const yearEl = document.getElementById("current-year");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (tagline) {
  const hour = new Date().getHours();
  let greeting = "Prepárate para destacar hoy.";

  if (hour < 12) {
    greeting = "Buena mañana: entrena tu mente desde temprano.";
  } else if (hour < 19) {
    greeting = "Buena tarde: mide tu nivel con preguntas reales.";
  } else {
    greeting = "Buena noche: practica con foco y mejora tu puntaje.";
  }

  tagline.textContent = `${tagline.textContent} ${greeting}`;
}

cards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 80}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

cards.forEach((card) => observer.observe(card));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    window.setTimeout(() => {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }, 450);
  });
});
