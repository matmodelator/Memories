//const slot = document.getElementById("nav-slot");

//if (slot) {
//  fetch("/Memories/nav.html")
  //  .then(r => r.text())
//    .then(html => {
//      slot.innerHTML = html;

      // определяем текущую страницу
 //     const path = window.location.pathname;

//      if (path.includes("poems")) {
//        document.querySelector('[data-text="Стихи"]')?.classList.add("nav-active");
 //     }

 //     if (path.includes("prosa")) {
 //       document.querySelector('[data-text="Проза"]')?.classList.add("nav-active");
//      }

 //     if (path.includes("songs")) {
//        document.querySelector('[data-text="Песни"]')?.classList.add("nav-active");
//      }

//      if (path.includes("author")) {
    //    document.querySelector('[data-text="Автор"]')?.classList.add("nav-active");
//      }
//    });
//}






document.addEventListener("DOMContentLoaded", function () {

  const slot = document.getElementById("nav-slot");
  if (!slot) return;

  fetch("/Memories/components/nav-panel.html")
    .then(response => response.text())
    .then(html => {

      slot.innerHTML = html;

      // Определяем текущую страницу
      const path = window.location.pathname;

      const navItems = document.querySelectorAll(".nav-item");

      navItems.forEach(item => {

        const text = item.getAttribute("data-text");

        if (text === "Стихи" && path.includes("poems"))
          item.classList.add("nav-active");

        if (text === "Проза" && path.includes("prosa"))
          item.classList.add("nav-active");

        if (text === "Песни" && path.includes("songs"))
          item.classList.add("nav-active");

        if (text === "Контакты" && path.includes("contacts"))
          item.classList.add("nav-active");

      });

    });

});
