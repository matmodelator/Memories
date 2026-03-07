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
