<script>
/*const MEMORY_LINES = [
  "И это было…",
  "Как будто память держит свет",
  "Не всё исчезает бесследно",
  "Есть вещи, которые возвращаются",
  "Имена уходят — интонации остаются",
  "То, что прошло, продолжает говорить",
  "Слова остаются где-то рядом",
  "И кто-то всё ещё ждёт"
];*/



// Глобальный массив, который будет использовать effect.js
window.MEMORY_LINES = [];

document.addEventListener("DOMContentLoaded", async function () {

  // ==================================================
  // 1. ТАБЛИЦА (HTML ССЫЛКИ)
  // ==================================================

  // 👇 сюда просто копируешь свои <a> строки
  const POEM_TABLE_HTML = `
    <a class="scroll-link" href="poems/shablon.html">TEST</a>
    <a class="scroll-link" href="poems/poem_af.html">Афтаркия</a>
    <a class="scroll-link" href="poems/poem_ba1.html">Барахас. Дождь. Кончается февраль.</a>
  `;


  // ==================================================
  // 2. ПАРСИМ HTML → ПОЛУЧАЕМ ССЫЛКИ
  // ==================================================

  const parser = new DOMParser();
  const doc = parser.parseFromString(POEM_TABLE_HTML, "text/html");

  const links = [...doc.querySelectorAll("a.scroll-link")];

  const pages = links
    .map(a => a.getAttribute("href"))
    .filter(href => href && href.includes("poem_") && href.endsWith(".html"));


  // сюда собираем все строки
  const collected = [];


  // ==================================================
  // 3. ЧИТАЕМ КАЖДЫЙ poem_*.html
  // ==================================================

  for (const path of pages) {
    try {
      const response = await fetch(path);
      if (!response.ok) continue;

      const pageHtml = await response.text();

      // ==================================================
      // 4. ВЫТАСКИВАЕМ resume
      // ==================================================

      const match = pageHtml.match(/resume\s*:\s*`([\s\S]*?)`/);

      if (!match) continue;

      const resumeText = match[1];

      // ==================================================
      // 5. РАЗБИВАЕМ НА СТРОКИ
      // ==================================================

      const lines = resumeText
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);

      collected.push(...lines);

    } catch (e) {
      // ошибка одного файла не ломает всё
    }
  }


  // ==================================================
  // 6. ПЕРЕМЕШИВАЕМ
  // ==================================================

  window.MEMORY_LINES = collected.sort(() => Math.random() - 0.5);


  // ==================================================
  // 7. СИГНАЛ ДЛЯ effect.js
  // ==================================================

  window.dispatchEvent(new Event("memoryLinesReady"));

});
