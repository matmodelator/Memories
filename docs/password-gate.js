document.addEventListener("DOMContentLoaded", function () {

  const correctPassword = document.body.dataset.password;
  if (!correctPassword) return;

  document.body.classList.add("locked");

  const gate = document.createElement("div");
  gate.className = "password-gate";

  gate.innerHTML = `
    <div class="password-box">
      <div class="password-title">Введите пароль</div>
      <input type="password" class="password-input" id="page-password">
      <button class="password-btn" id="password-btn">Открыть</button>
      <div class="password-error" id="password-error"></div>
    </div>
  `;

  document.body.appendChild(gate);

  const input = document.getElementById("page-password");
  const btn = document.getElementById("password-btn");
  const error = document.getElementById("password-error");

  function checkPassword() {
    if (input.value === correctPassword) {
      gate.remove();
      document.body.classList.remove("locked");
    } else {
      error.textContent = "Неверный пароль";
    }
  }

  btn.addEventListener("click", checkPassword);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkPassword();
  });

});
