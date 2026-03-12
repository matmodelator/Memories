document.addEventListener("DOMContentLoaded", function () {
  const pass = document.body.dataset.password;
  if (!pass) return;

  const gate = document.createElement("div");

  gate.innerHTML = `
    <div id="password-box">
      <div id="password-title">Введите пароль</div>
      <input type="password" id="password-input" autocomplete="off">
      <button id="password-btn">Открыть</button>
      <div id="password-error"></div>
    </div>
  `;

  gate.style.position = "fixed";
  gate.style.inset = "0";
  gate.style.background = "rgba(0,0,0,0.78)";
  gate.style.display = "flex";
  gate.style.alignItems = "center";
  gate.style.justifyContent = "center";
  gate.style.zIndex = "999999";

  document.body.appendChild(gate);
  /*document.body.classList.add("password-lock");*/

  const box = document.getElementById("password-gate-box");
  const form = document.getElementById("password-form");
  const input = document.getElementById("page-password");
  const button = document.getElementById("password-btn");
  const error = document.getElementById("password-error");
  const title = document.getElementById("password-gate-title");

  box.style.width = "320px";
  box.style.maxWidth = "calc(100vw - 32px)";
  box.style.padding = "24px";
  box.style.borderRadius = "16px";
  box.style.background = "rgba(20,20,20,0.98)";
  box.style.border = "1px solid rgba(255,255,255,0.18)";
  box.style.boxSizing = "border-box";
  box.style.textAlign = "center";

  title.style.marginBottom = "14px";
  title.style.fontSize = "20px";
  title.style.color = "#fff";

  input.style.width = "100%";
  input.style.boxSizing = "border-box";
  input.style.padding = "10px 12px";
  input.style.marginBottom = "12px";
  input.style.borderRadius = "10px";
  input.style.border = "1px solid rgba(255,255,255,0.2)";
  input.style.background = "rgba(255,255,255,0.08)";
  input.style.color = "#fff";
  input.style.fontSize = "16px";

  button.style.padding = "10px 18px";
  button.style.border = "0";
  button.style.borderRadius = "10px";
  button.style.fontSize = "16px";
  button.style.cursor = "pointer";

  error.style.marginTop = "10px";
  error.style.minHeight = "20px";
  error.style.color = "#ff8a8a";
  error.style.fontSize = "14px";

  function stopAll(e) {
    e.stopPropagation();
  }

  gate.addEventListener("click", stopAll, true);
  gate.addEventListener("mousedown", stopAll, true);
  gate.addEventListener("touchstart", stopAll, true);
  gate.addEventListener("pointerdown", stopAll, true);

  function unlock() {
    gate.remove();
   /*document.body.classList.remove("password-lock"); */
  }

  function checkPassword(e) {
    e.preventDefault();

    if (input.value === correctPassword) {
      unlock();
    } else {
      error.textContent = "Неверный пароль";
      input.value = "";
      input.focus();
    }
  }

  form.addEventListener("submit", checkPassword);

  setTimeout(function () {
    input.focus();
  }, 50);
});
