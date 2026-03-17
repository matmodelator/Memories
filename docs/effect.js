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

  // как часто появляется новая фраза
  const SPAWN_DELAY = 1800;

  // через сколько начинается исчезновение
  const FADE_DELAY = 3200;


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

      // 👇 все строки рукописные
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

        // удаляем только после окончания fade
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
  // 4. ЖДЁМ, ПОКА СОБЕРЁТСЯ МАССИВ
  // ==================================================
  function waitForLinesAndStart() {

    // если массив уже готов — запускаем сразу
    if (window.MEMORY_LINES && window.MEMORY_LINES.length) {
      startEffect(window.MEMORY_LINES);
      return;
    }

    // иначе ждём событие от lines.js
    window.addEventListener("memoryLinesReady", function () {
      startEffect(window.MEMORY_LINES);
    }, { once: true });
  }


  // ==================================================
  // 5. ЗАПУСК ОЖИДАНИЯ
  // ==================================================
  waitForLinesAndStart();

});
