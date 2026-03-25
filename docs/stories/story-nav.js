document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("story-nav");
  if (!container) return;

  // сразу показываем стрелки
  let prevPath = "#";
  let nextPath = "#";

  container.innerHTML = `
    <div class="story-nav">
      <a href="${prevPath}">▲</a>
      <a href="${nextPath}">▼</a>
    </div>
  `;

  try {
    const current = location.pathname.split("/").pop();

    const response = await fetch("/Memories/stories.html");
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const links = [...doc.querySelectorAll("a[href$='.html']")];
    const files = links.map(a => a.getAttribute("href"));
    const names = files.map(href => href.split("/").pop());

    const index = names.indexOf(current);

    if (index !== -1) {
      if (files[index - 1]) {
        prevPath = files[index - 1].replace(/^stories\//, "");
      }

      if (files[index + 1]) {
        nextPath = files[index + 1].replace(/^srories\//, "");
      }
    }

    container.innerHTML = `
      <div class="story-nav">
        <a href="${prevPath}">▲</a>
        <a href="${nextPath}">▼</a>
      </div>
    `;
  } catch (e) {
    // стрелки уже показаны, ничего не делаем
  }
});
