document.addEventListener("DOMContentLoaded", async function () {

  const current = location.pathname.split("/").pop();

  const response = await fetch("../poem.html");
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const links = [...doc.querySelectorAll("a[href]")];

  const files = links
    .map(a => a.getAttribute("href"))
    .filter(href => href && href.includes("poem_"));

  const names = files.map(href => href.split("/").pop());

  const index = names.indexOf(current);
  if (index === -1) return;

  const prev = files[index - 1];
  const next = files[index + 1];

  let nav = '<div class="poem-nav">';

  if (prev) nav += `<a href="../${prev}">🔼</a>`;
  if (next) nav += `<a href="../${next}">🔽</a>`;

  nav += '</div>';

  const container = document.getElementById("poem-nav");
  if (container) container.innerHTML = nav;

});
