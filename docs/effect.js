document.addEventListener("DOMContentLoaded", function () {


  // ==================================================
  // 1. ИЩЕМ КОНТЕЙНЕР, КУДА БУДУТ ПОПАДАТЬ ФРАЗЫ
  // ==================================================
  const field = document.querySelector(".memory-field");

  // если блока нет — скрипт дальше не работает
  if (!field) return;


  // ==================================================
  // 2. НАСТРОЙКИ
  // ==================================================
  const SPAWN_DELAY = 1800;

  // сюда потом положим готовый массив
  let lines = [];


  // ==================================================
  // 3. БЛОК ЭФФЕКТА
  // ==================================================
  function spawnLine() {

    const el = document.createElement("div");
    el.className = "memory-ghost";


    // 👇 СЛУЧАЙНЫЙ ШРИФТ
  const fonts = [
    "hand-1","hand-2","hand-3","hand-4","hand-5","hand-6",
    "hand-7","hand-8","hand-9","hand-10","hand-11","hand-12"
  ];

  const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
  el.classList.add(randomFont);

    // 👇 РАНДОМНЫЙ НАКЛОН
const skew = (Math.random() * 8 + 2);
const scale = 1 + Math.random() * 0.1;

el.style.transform =
  `translate(-50%, -50%) scale(${scale}) skewX(${skew}deg)`;

  /*  // 👇 все строки рукописные
    el.classList.add("hand");

    const skew = -3 - Math.random() * 6;
    const scale = 0.96 + Math.random() * 0.08;

    el.style.transform =
      `translate(-50%, -50%) scale(${scale}) skewX(${skew}deg)`; */

    // берём случайную фразу из готового массива
    const text = lines[Math.floor(Math.random() * lines.length)];
    el.textContent = text;

    // случайная позиция в центральной зоне экрана
    // X: от 35% до 65%
    // Y: от 35% до 65%
    const x = 35 + Math.random() * 30;
    const y = 35 + Math.random() * 30;

    el.style.left = x + "%";
    el.style.top = y + "%";

    // вставляем фразу в контейнер
    field.appendChild(el);

    // небольшая задержка перед появлением
    setTimeout(function () {
      el.classList.add("show");
    }, 50);

    // запускаем фазу исчезновения
    setTimeout(function () {
      el.classList.add("fade");
    }, 3500);

    // удаляем после окончания плавного ухода
    setTimeout(function () {
      el.remove();
    }, 6300);
  }


  // ==================================================
  // 4. ЗАПУСК, КОГДА МАССИВ ГОТОВ
  // ==================================================
  function startWhenReady() {

    if (!window.MEMORY_LINES || !window.MEMORY_LINES.length) return;

    lines = window.MEMORY_LINES;

    spawnLine();
    setInterval(spawnLine, SPAWN_DELAY);
  }


  // ==================================================
  // 5. ЖДЁМ ГОТОВЫЙ МАССИВ
  // ==================================================
  if (window.MEMORY_LINES && window.MEMORY_LINES.length) {
    startWhenReady();
  } else {
    window.addEventListener("memoryLinesReady", function () {
      startWhenReady();
    }, { once: true });
  }

});
