const slot = document.getElementById("nav-slot");

if (slot) {
  fetch("/Memories/nav.html")
    .then(r => r.text())
    .then(html => {
      slot.innerHTML = html;

      // определяем текущую страницу
      const path = window.location.pathname;

      if (path.includes("poems")) {
        document.querySelector('[data-text="Стихи"]')?.classList.add("nav-active");
      }

      if (path.includes("prosa")) {
        document.querySelector('[data-text="Проза"]')?.classList.add("nav-active");
      }

      if (path.includes("songs")) {
        document.querySelector('[data-text="Песни"]')?.classList.add("nav-active");
      }

      if (path.includes("author")) {
        document.querySelector('[data-text="Автор"]')?.classList.add("nav-active");
      }
    });
}
