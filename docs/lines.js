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

  // сюда собираем все строки из всех poem_*.html
  const collected = [];

  try {
    // 1. Загружаем poems.html (это наш "список файлов")
    const res = await fetch("poems.html");
    const html = await res.text();

    // 2. Парсим HTML, чтобы работать как с DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // 3. Находим все ссылки, содержащие poem_
    const links = [...doc.querySelectorAll("a[href*='poem_']")];

    // 4. Достаём пути к файлам
    const pages = links
      .map(a => a.getAttribute("href"))
      .filter(href => href && href.includes("poem_"));

    // 5. Обходим каждую страницу стихотворения
    for (const path of pages) {
      try {
        const response = await fetch(path);
        if (!response.ok) continue; // если файл не найден — пропускаем

        const pageHtml = await response.text();

        // 6. Вытаскиваем поле resume из объекта poem
        // Ищем: resume: `...`
        const match = pageHtml.match(/resume:\s*`([\s\S]*?)`/);

        if (!match) continue; // если resume нет — пропускаем

        const resumeText = match[1];

        // 7. Разбиваем на строки
        const lines = resumeText
          .split("\n")        // разбили по строкам
          .map(s => s.trim())// убрали пробелы
          .filter(Boolean);  // убрали пустые строки

        // 8. Добавляем все строки в общий массив
        collected.push(...lines);

      } catch (e) {
        // если ошибка загрузки конкретного файла — просто игнорируем
      }
    }

  } catch (e) {
    // если не загрузился poems.html — тоже тихо падаем
  }

  // 9. Перемешиваем строки (рандомный порядок)
  window.MEMORY_LINES = collected.sort(() => Math.random() - 0.5);

  // 10. Сообщаем effect.js, что данные готовы
  window.dispatchEvent(new Event("memoryLinesReady"));

});
