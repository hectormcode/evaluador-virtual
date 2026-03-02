const questions = [
  {
    question:
      "Carla observa que un abrigo cuesta cuatro veces más que una blusa. El abrigo sube 22% y la blusa 10%. Si compra ambas prendas, ¿en qué porcentaje aumentó el valor total de la compra?",
    options: ["15%", "25%", "24%", "20%"],
    answer: 3,
    explanation:
      "Si la blusa vale b, el abrigo vale 5b (cuatro veces más). El aumento total es (5b*22% + b*10%) / 6b = 20%.",
  },
  {
    question:
      "Sabiendo que ~(p -> q) /\\ (q \\/ ~r) es verdadero, deduce el valor de verdad de: (q -> r) <-> [q /\\ (~p \\/ x)]",
    options: ["Verdadero", "Falso", "No se puede determinar", "Depende del valor de x"],
    answer: 1,
    explanation:
      "De ~(p->q) se obtiene p=V y q=F; de (q \\/ ~r) con q=F se obtiene r=F. Entonces (q->r)=V y [q /\\ (~p \\/ x)]=F, por lo tanto V<->F es F.",
  },
  {
    question: "El área de un triángulo de base 8 y altura 5 es:",
    options: ["13", "20", "40", "10"],
    answer: 1,
    explanation: "A = (base * altura) / 2 = (8 * 5) / 2 = 20.",
  },
  {
    question: "La suma de ángulos internos de un triángulo es:",
    options: ["90°", "180°", "270°", "360°"],
    answer: 1,
    explanation: "En todo triángulo, la suma interna es 180°.",
  },
  {
    question: "Si el perímetro de un cuadrado es 36, su lado mide:",
    options: ["6", "9", "12", "18"],
    answer: 1,
    explanation: "Lado = perímetro / 4 = 36 / 4 = 9.",
  },
  {
    question: "Factoriza: x^2 - 9",
    options: ["(x - 9)(x + 1)", "(x - 3)(x + 3)", "(x - 1)(x + 9)", "(x - 3)^2"],
    answer: 1,
    explanation: "Es una diferencia de cuadrados: a^2 - b^2 = (a - b)(a + b).",
  },
  {
    question: "Si una recta tiene pendiente 0, entonces es:",
    options: ["Vertical", "Horizontal", "Diagonal", "Curva"],
    answer: 1,
    explanation: "Pendiente 0 representa una recta horizontal.",
  },
  {
    question: "Resuelve: (x/4) + 3 = 7",
    options: ["x = 8", "x = 10", "x = 12", "x = 16"],
    answer: 3,
    explanation: "x/4 = 4, luego x = 16.",
  },
  {
    question: "Si 2x + 5 = 17, el valor de x es:",
    options: ["5", "6", "7", "8"],
    answer: 1,
    explanation: "2x = 12, por lo tanto x = 6.",
  },
  {
    question: "Simplifica: 5a - 2a + 7",
    options: ["3a + 7", "7a - 2", "5a + 7", "3a - 7"],
    answer: 0,
    explanation: "5a - 2a = 3a, queda 3a + 7.",
  },
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const retryBtn = document.getElementById("retry-btn");
const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");

const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const timerEl = document.getElementById("timer");
const questionTitle = document.getElementById("question-title");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");

const scoreText = document.getElementById("score-text");
const levelText = document.getElementById("level-text");
const bestScoreText = document.getElementById("best-score-text");
const reviewList = document.getElementById("review-list");

const totalTime = 10 * 60;
const bestScoreKey = "simulaunmsm_best_score";

let currentIndex = 0;
let selectedOption = null;
let score = 0;
let timeLeft = totalTime;
let timerId = null;
let answered = false;
let answers = [];

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function renderQuestion() {
  const item = questions[currentIndex];
  progressText.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`;
  progressBar.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  questionTitle.textContent = item.question;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  selectedOption = null;
  answered = false;

  optionsEl.innerHTML = "";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => selectOption(index, button));
    optionsEl.appendChild(button);
  });

  checkBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
}

function selectOption(index, button) {
  if (answered) return;
  selectedOption = index;

  const buttons = optionsEl.querySelectorAll(".option-btn");
  buttons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
}

function markOptions(correctIndex) {
  const buttons = optionsEl.querySelectorAll(".option-btn");
  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === correctIndex) {
      btn.classList.add("correct");
    } else if (index === selectedOption) {
      btn.classList.add("incorrect");
    }
  });
}

function validateAnswer() {
  if (selectedOption === null || answered) {
    feedbackEl.textContent = "Selecciona una alternativa antes de validar.";
    feedbackEl.className = "feedback error";
    return;
  }

  answered = true;
  const item = questions[currentIndex];
  const isCorrect = selectedOption === item.answer;

  if (isCorrect) {
    score += 1;
    feedbackEl.textContent = `Correcto. ${item.explanation}`;
    feedbackEl.className = "feedback success";
  } else {
    feedbackEl.textContent = `Incorrecto. ${item.explanation}`;
    feedbackEl.className = "feedback error";
  }

  answers.push({
    question: item.question,
    selected: selectedOption,
    correct: item.answer,
    isCorrect,
  });

  markOptions(item.answer);
  checkBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
}

function goNext() {
  if (!answered) return;
  currentIndex += 1;

  if (currentIndex >= questions.length) {
    finishQuiz();
    return;
  }

  renderQuestion();
}

function timerTick() {
  timeLeft -= 1;
  timerEl.textContent = formatTime(timeLeft);

  if (timeLeft <= 60) {
    timerEl.classList.add("low-time");
  }

  if (timeLeft <= 0) {
    finishQuiz();
  }
}

function getLevel(percentage) {
  if (percentage >= 90) return "Nivel sobresaliente. Mantén ese ritmo.";
  if (percentage >= 70) return "Buen nivel. Puedes afinar con más práctica.";
  if (percentage >= 50) return "Base aceptable. Refuerza los temas clave.";
  return "Nivel inicial. Conviene repasar fundamentos.";
}

function renderReview() {
  reviewList.innerHTML = "";
  answers.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = `review-item ${item.isCorrect ? "ok" : "fail"}`;
    const state = item.isCorrect ? "Correcta" : "Incorrecta";
    const userAnswer = questions[index].options[item.selected] || "Sin respuesta";
    const rightAnswer = questions[index].options[item.correct];
    row.innerHTML = `
      <strong>${index + 1}. ${state}</strong>
      <p>${item.question}</p>
      <p>Tu respuesta: ${userAnswer}</p>
      <p>Respuesta correcta: ${rightAnswer}</p>
    `;
    reviewList.appendChild(row);
  });
}

function finishQuiz() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const percentage = Math.round((score / questions.length) * 100);
  scoreText.textContent = `Obtuviste ${score} de ${questions.length} (${percentage}%).`;
  levelText.textContent = getLevel(percentage);

  const previousBest = Number(localStorage.getItem(bestScoreKey) || 0);
  const currentBest = Math.max(previousBest, score);
  localStorage.setItem(bestScoreKey, String(currentBest));
  bestScoreText.textContent = `Mejor puntaje histórico en este navegador: ${currentBest}/${questions.length}.`;

  renderReview();
}

function resetState() {
  currentIndex = 0;
  selectedOption = null;
  score = 0;
  timeLeft = totalTime;
  answered = false;
  answers = [];
  timerEl.textContent = formatTime(timeLeft);
  timerEl.classList.remove("low-time");
}

function startQuiz() {
  resetState();
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  renderQuestion();

  if (timerId) clearInterval(timerId);
  timerId = setInterval(timerTick, 1000);
}

startBtn.addEventListener("click", startQuiz);
retryBtn.addEventListener("click", startQuiz);
checkBtn.addEventListener("click", validateAnswer);
nextBtn.addEventListener("click", goNext);
