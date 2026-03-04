document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector(".nav-trigger");
  const dropdown = document.querySelector(".nav-dropdown");

  if (!trigger || !dropdown) return;

  trigger.addEventListener("click", (e) => {
    e.preventDefault();              // чтобы не уходило по ссылке
    dropdown.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== trigger) {
      dropdown.classList.remove("open");
    }
  });
});
