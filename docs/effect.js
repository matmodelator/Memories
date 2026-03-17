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



// 📜 Загрузка фраз (ОБЪЕДИНЕНИЕ)

// режим:
// "js"   → только lines.js
// "txt"  → только phrases.txt
// "both" → ОБА источника
const SOURCE = "both";

let MEMORY_LINES = [];

// 👉 1. Берем из lines.js (если есть)
function loadFromJS() {
  if (window.MEMORY_LINES && Array.isArray(window.MEMORY_LINES)) {
    return window.MEMORY_LINES;
  }
  return [];
}

// 👉 2. Берем из txt
async function loadFromTXT() {
  try {
    const response = await fetch("phrases.txt");
    const text = await response.text();

    return text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

  } catch (e) {
    console.log("TXT не загрузился", e);
    return [];
  }
}

// 👉 3. ОБЪЕДИНЕНИЕ
async function loadLines() {

  let lines = [];

  if (SOURCE === "js" || SOURCE === "both") {
    lines = lines.concat(loadFromJS());
  }

  if (SOURCE === "txt" || SOURCE === "both") {
    const txtLines = await loadFromTXT();
    lines = lines.concat(txtLines);
  }

  // 👉 удаляем дубли (важно)
  MEMORY_LINES = [...new Set(lines)];

  // сигнал системе
  window.MEMORY_LINES = MEMORY_LINES;

  window.dispatchEvent(new Event("memoryLinesReady"));
}

// запуск
loadLines();
 

  // путь к txt-файлу
  const TXT_PATH = "phrases.txt";

  // как часто появляется новая фраза
  const SPAWN_DELAY = 1800;

  // через сколько начинается исчезновение
  const FADE_DELAY = 3200;

  // через сколько полностью удаляем фразу из DOM
  const REMOVE_DELAY = 6000;


  // ==================================================
  // 3. ЗАПУСК ЭФФЕКТА
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
        el.remove();
      }, REMOVE_DELAY);
    }

    // первая фраза появляется сразу
    spawnLine();

    // остальные появляются по таймеру
    setInterval(spawnLine, SPAWN_DELAY);
  }


  // ==================================================
  // 4. ВАРИАНТ 1 — ФРАЗЫ ИЗ lines.js
  // ==================================================
  if (SOURCE === "js") {

    // если lines.js уже успел подготовить массив
    if (window.MEMORY_LINES && window.MEMORY_LINES.length) {
      startEffect(window.MEMORY_LINES);
    }

    // если ещё не успел — ждём специальное событие
    window.addEventListener("memoryLinesReady", function () {
      startEffect(window.MEMORY_LINES);
    }, { once: true });
  }


  // ==================================================
  // 5. ВАРИАНТ 2 — ФРАЗЫ ИЗ phrases.txt
  // ==================================================
  if (SOURCE === "txt") {

    fetch(TXT_PATH)
      .then(function (res) {
        return res.text();
      })
      .then(function (text) {

        // делим txt по строкам
        // убираем пробелы по краям
        // убираем пустые строки
        const lines = text
          .split("\n")
          .map(function (s) {
            return s.trim();
          })
          .filter(Boolean);

        // запускаем эффект уже с фразами из txt
        startEffect(lines);
      })
      .catch(function () {

        // если txt не загрузился —
        // пробуем использовать lines.js как запасной вариант
        if (window.MEMORY_LINES && window.MEMORY_LINES.length) {
          startEffect(window.MEMORY_LINES);
        }

        // если и там пусто — просто ничего не делаем
      });
  }

});
