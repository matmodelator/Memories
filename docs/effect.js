document.addEventListener("DOMContentLoaded", function () {

  const field = document.querySelector(".memory-field");
  if (!field) return;

  // запуск эффекта, когда список фраз уже готов
  function startEffect(lines) {
    if (!lines || !lines.length) return;

    function spawnLine() {
      const el = document.createElement("div");
      el.className = "memory-ghost";

      // случайная фраза из lines.js
      const text = lines[Math.floor(Math.random() * lines.length)];
      el.textContent = text;

      // случайная позиция в центральной зоне
      const x = 35 + Math.random() * 30;
      const y = 35 + Math.random() * 30;

      el.style.left = x + "%";
      el.style.top = y + "%";

      field.appendChild(el);

      // плавное появление
      setTimeout(function () {
        el.classList.add("show");
      }, 50);

      // плавное исчезновение
      setTimeout(function () {
        el.classList.add("fade");
      }, 3200);

      // удаление из DOM
      setTimeout(function () {
        el.remove();
      }, 6000);
    }

    // первая фраза сразу
    spawnLine();

    // дальше по таймеру
    setInterval(spawnLine, 1800);
  }

  // если lines.js уже успел собрать фразы
  if (window.MEMORY_LINES && window.MEMORY_LINES.length) {
    startEffect(window.MEMORY_LINES);
  }

  // если ещё не успел — ждём событие от lines.js
  window.addEventListener("memoryLinesReady", function () {
    startEffect(window.MEMORY_LINES);
  }, { once: true });

});
