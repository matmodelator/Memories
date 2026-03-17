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

  // сюда соберём все фразы:
  // сначала из lines.js, потом из phrases.txt
  let MEMORY_LINES = [];

  // как часто появляется новая фраза
  const SPAWN_DELAY = 1800;

  // через сколько начинается исчезновение
  const FADE_DELAY = 3200;

  // через сколько полностью удаляем фразу из DOM
  const REMOVE_DELAY = 6000;


  // ==================================================
  // 3. ЗАГРУЗКА ФРАЗ ИЗ lines.js
  // ==================================================
  function loadFromJS() {

    // если lines.js уже создал window.MEMORY_LINES
    // и там действительно массив — возвращаем его
    if (window.MEMORY_LINES && Array.isArray(window.MEMORY_LINES)) {
      return window.MEMORY_LINES;
    }

    // иначе возвращаем пустой массив
    return [];
  }


  // ==================================================
  // 4. ЗАГРУЗКА ФРАЗ ИЗ phrases.txt
  // ==================================================
  async function loadFromTXT() {
    try {
      const response = await fetch("phrases.txt");
      const text = await response.text();

      // делим текст на строки
      // обрезаем пробелы
      // убираем пустые строки
      return text
        .split("\n")
        .map(function (line) {
          return line.trim();
        })
        .filter(function (line) {
          return line.length > 0;
        });

    } catch (e) {
      console.log("Не удалось загрузить phrases.txt", e);
      return [];
    }
  }


  // ==================================================
  // 5. ОБЪЕДИНЕНИЕ ФРАЗ
  // ==================================================
  async function loadLines() {

    // берём массив из lines.js
    const jsLines = loadFromJS();

    // берём массив из phrases.txt
    const txtLines = await loadFromTXT();

    // объединяем оба массива в один
    MEMORY_LINES = jsLines.concat(txtLines);

    // если нужно убрать дубли — раскомментируй строку ниже
    // MEMORY_LINES = [...new Set(MEMORY_LINES)];

    // записываем общий массив в window.MEMORY_LINES,
    // чтобы остальной код работал как раньше
    window.MEMORY_LINES = MEMORY_LINES;

    // сообщаем, что фразы уже готовы
    window.dispatchEvent(new Event("memoryLinesReady"));
  }


  // ==================================================
  // 6. ЗАПУСК ЭФФЕКТА
  // ==================================================
  function startEffect(lines) {

    // защита: если массива нет или он пустой — выходим
    if (!lines || !lines.length) return;

    // функция создания одной "призрачной" фразы
    function spawnLine() {

      // создаём новый div для фразы
      const el = document.createElement("div");
      el.className = "memory-ghost";

      // 👇 ВСЕ строки рукописные
      el.classList.add("hand");

      const skew = -3 - Math.random() * 6;
      const scale = 0.96 + Math.random() * 0.08;

      el.style.transform =
        `translate(-50%, -50%) scale(${scale}) skewX(${skew}deg)`;

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
      }, FADE_DELAY);

      // полностью удаляем элемент
      setTimeout(function () {
  el.classList.add("fade");

  el.addEventListener("transitionend", function () {
    el.remove();
  }, { once: true });

}, FADE_DELAY);
    }

    // первая фраза появляется сразу
    spawnLine();

    // остальные появляются по таймеру
    setInterval(spawnLine, SPAWN_DELAY);
  }


  // ==================================================
  // 7. ЕДИНЫЙ ЗАПУСК
  // ==================================================

  // ждём, пока объединённый массив будет готов,
  // и только потом запускаем эффект
  window.addEventListener("memoryLinesReady", function () {
    if (window.MEMORY_LINES && window.MEMORY_LINES.length) {
      startEffect(window.MEMORY_LINES);
    }
  }, { once: true });


  // ==================================================
  // 8. ЗАПУСКАЕМ ЗАГРУЗКУ ФРАЗ
  // ==================================================
  loadLines();

});
