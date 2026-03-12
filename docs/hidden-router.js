document.addEventListener("DOMContentLoaded", function () {
  const poemEl = document.getElementById("poem");
  const metaEl = document.getElementById("meta");

  if (!poemEl) return;
  if (!window.HIDDEN_POEMS) return;

  const ACCESS_PASSWORD = "rose1984";
  const CONTENT_KEY = "fixed-content-key-2026-memories";

  const path = location.pathname.replace(/^\/+|\/+$/g, "");
  const parts = path.split("/");

  // Ожидаем:
  // Memories / hidden / poem_test
  if (parts.length < 3) return;
  if (parts[0] !== "Memories") return;
  if (parts[1] !== "hidden") return;

  const poemKey = parts[2];
  const item = window.HIDDEN_POEMS[poemKey];
  if (!item) return;

  function base64ToBytes(base64) {
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
  }

  async function deriveKey(passwordText, saltBytes) {
    const enc = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(passwordText),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations: 250000,
        hash: "SHA-256"
      },
      keyMaterial,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["decrypt"]
    );
  }

  async function decryptText() {
    const salt = base64ToBytes(item.salt);
    const iv = base64ToBytes(item.iv);
    const data = base64ToBytes(item.data);

    const key = await deriveKey(CONTENT_KEY, salt);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  }

  const gate = document.createElement("div");
  gate.innerHTML = `
    <div id="password-gate-box">
      <div id="password-gate-title">Введите пароль</div>
      <form id="password-form" autocomplete="off">
        <input
          type="password"
          id="page-password"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
        >
        <button type="submit" id="password-btn">Открыть</button>
      </form>
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

  async function checkPassword(e) {
    e.preventDefault();

    if (input.value !== ACCESS_PASSWORD) {
      error.textContent = "Неверный пароль";
      input.value = "";
      input.focus();
      return;
    }

    try {
      const text = await decryptText();
      poemEl.textContent = text;

      if (metaEl) {
        metaEl.textContent = `${item.title} — ${item.year}`;
      }

      document.title = item.title;
      gate.remove();
    } catch {
      error.textContent = "Ошибка расшифровки";
    }
  }

  form.addEventListener("submit", checkPassword);

  setTimeout(function () {
    input.focus();
  }, 50);
});
