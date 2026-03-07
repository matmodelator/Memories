 /*document.addEventListener("DOMContentLoaded", function () { 
  const container = document.getElementById("poem-nav");
  if (container) {
    container.innerHTML = `
      <div class="poem-nav">
        <a href="#">🔼</a>
        <a href="#">🔽</a>
      </div>
    `;
  }
}); */



/*document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("poem-nav");
  if (!container) return;

  const prevPath = "poem_tsc1.html";
  const nextPath = "poem_tsc2.html";

  container.innerHTML = `
    <div class="poem-nav">
      <a href="${prevPath}">🔼</a>
      <a href="${nextPath}">🔽</a>
    </div>
  `;
});*/

document.addEventListener("DOMContentLoaded", async function () {

  const container = document.getElementById("poem-nav");
  if (!container) return;

  // пути по умолчанию (стрелки всегда появятся)
  let prevPath = "#";
  let nextPath = "#";

  try {

    const current = location.pathname.split("/").pop();

    const response = await fetch("/Memories/poems.html");
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const links = [...doc.querySelectorAll("a[href$='.html']")];

    const files = links.map(a => a.getAttribute("href"));
    const names = files.map(href => href.split("/").pop());

    const index = names.indexOf(current);

    if (index !== -1) {

      if (files[index - 1]) {
        prevPath = files[index - 1];
      }

      if (files[index + 1]) {
        nextPath = files[index + 1];
      }

    }

  } catch (e) {}

  container.innerHTML = `
    <div class="poem-nav">
      <a href="${prevPath}">🔼</a>
      <a href="${nextPath}">🔽</a>
    </div>
  `;

});

