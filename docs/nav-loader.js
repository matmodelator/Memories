document.addEventListener("DOMContentLoaded", function () {
  const slot = document.getElementById("nav-slot");
  if (!slot) return;

  fetch("components/nav-panel.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Файл меню не найден: components/nav-panel.html");
      }
      return response.text();
    })
    .then(html => {
      slot.innerHTML = html;

      const path = window.location.pathname;
      const navItems = document.querySelectorAll(".nav-item");

      navItems.forEach(item => {
        const text = item.getAttribute("data-text");

        if (text === "Стихи" && path.includes("poems")) {
          item.classList.add("nav-active");
        }

        if (text === "Проза" && path.includes("prosa")) {
          item.classList.add("nav-active");
        }

        if (text === "Песни" && path.includes("songs")) {
          item.classList.add("nav-active");
        }

        if (text === "Контакты" && path.includes("contacts")) {
          item.classList.add("nav-active");
        }
      });
    })
    .catch(error => {
      slot.innerHTML = "<div style='color:white;padding:10px;'>Меню не загрузилось</div>";
    });
});
