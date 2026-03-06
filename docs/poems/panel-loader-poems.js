document.addEventListener("DOMContentLoaded", function () {
  const slot = document.getElementById("scroll-slot");
  if (!slot) return;

  fetch("/Memories/components/scroll-poems.html")
    .then(r => r.text())
    .then(html => {
      slot.innerHTML = html;
    })
    .catch(err => console.error("Scroll panel load error:", err));
});
