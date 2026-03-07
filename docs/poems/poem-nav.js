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



document.addEventListener("DOMContentLoaded", function () {
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
});
