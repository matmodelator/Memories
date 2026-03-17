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



  window.MEMORY_LINES = [];

document.addEventListener("DOMContentLoaded", async function () {

  const collected = [];

  try {
    // загружаем список стихов
    const res = await fetch("poems.html");
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // все ссылки на poem_*.html
    const links = [...doc.querySelectorAll("a[href*='poem_']")];

    const pages = links
      .map(a => a.getAttribute("href"))
      .filter(href => href && href.includes("poem_"));

    // обходим все страницы
    for (const path of pages) {
      try {
        const response = await fetch(path);
        if (!response.ok) continue;

        const pageHtml = await response.text();

        // вытаскиваем review
        const match = pageHtml.match(/review:\s*`([\s\S]*?)`/);
        if (!match) continue;

        const reviewText = match[1];
        const lines = reviewText.split("\n");

        // берем строки до первой пустой
        for (let line of lines) {
          const clean = line.trim();
          if (clean === "") break;
          collected.push(clean);
        }

      } catch (e) {}
    }

  } catch (e) {}

  // 🔀 перемешивание
  window.MEMORY_LINES = collected.sort(() => Math.random() - 0.5);

  // сигнал эффекту
  window.dispatchEvent(new Event("memoryLinesReady"));

});
</script>
