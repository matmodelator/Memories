 document.addEventListener("DOMContentLoaded", function () { 
  const container = document.getElementById("poem-nav");
  if (container) {
    container.innerHTML = `
      <div class="poem-nav">
        <a href="#">🔼</a>
        <a href="#">🔽</a>
      </div>
    `;
  }
}); 



document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("poem-nav");
  if (!container) return;

  const current = location.pathname.split("/").pop();

  const match = current.match(/poem_(\d+)\.html/);
  if (!match) return;

  const num = parseInt(match[1]);

  const prev = "poem_" + (num - 1) + ".html";
  const next = "poem_" + (num + 1) + ".html";

  container.innerHTML = `
    <div class="poem-nav">
      <a href="${prev}">🔼</a>
      <a href="${next}">🔽</a>
    </div>
  `;

});
