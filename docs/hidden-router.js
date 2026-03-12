document.addEventListener("DOMContentLoaded", function () {
  const poemEl = document.getElementById("poem");
  const metaEl = document.getElementById("meta");

  if (!poemEl) return;
  if (!window.HIDDEN_POEMS) return;

  // Меняешь только это
  const ACCESS_PASSWORD = "rose1984";

  // Постоянный ключ шифрования текста
  const CONTENT_KEY = "fixed-content-key-2026-memories";

  const path = location.pathname.replace(/^\/+|\/+$/g, "");
  const parts = path.split("/");

  // Ожидаем:
  // Memories / hidden / poem_af / пароль
  if (parts.length < 4) return;
  if (parts[0] !== "Memories") return;
  if (parts[1] !== "hidden") return;

  const poemKey = parts[2];
  const password = decodeURIComponent(parts[3]);

  if (password !== ACCESS_PASSWORD) return;

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

  async function showHiddenPoem() {
    try {
      const text = await decryptText();

      poemEl.textContent = text;

      if (metaEl) {
        metaEl.textContent = `${item.title} — ${item.year}`;
      }

      document.title = item.title;
    } catch (e) {
      // остаётся обычная 404
    }
  }

  showHiddenPoem();
});
