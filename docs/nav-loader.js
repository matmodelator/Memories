const slot = document.getElementById("nav-slot");

if (slot) {
  fetch("/Memories/nav.html")
    .then(r => r.text())
    .then(html => {
      slot.innerHTML = html;
    });
}
