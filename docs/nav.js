// docs/nav.js
(function () {
  // 1) Определяем базовый путь сайта на GitHub Pages
  // Project Pages: https://user.github.io/Memories/  => base = "/Memories/"
  // User Pages:    https://user.github.io/          => base = "/"
  function getBasePath() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    // Если в URL есть /Memories/... — считаем это базой
    if (parts.length > 0 && parts[0].toLowerCase() === 'memories') return '/Memories/';
    return '/';
  }

  const base = getBasePath();

  // 2) Маршруты меню
  const routes = {
    home:  base + 'index.html',
    poems: base + 'poems.html',
    stories: base + 'stories.html',
    songs: base + 'songs.html',
    author: base + 'author.html',
  };

  // 3) Привязываем клики к пунктам меню по data-text или тексту
  function bindMenu() {
    const items = document.querySelectorAll('.main-nav .nav-item');
    if (!items.length) return;

    items.forEach((el) => {
      const label = ((el.getAttribute('data-text') || el.textContent || '')).trim();

      let target = null;
      if (label === 'Стихи') target = routes.poems;
      else if (label === 'Проза') target = routes.stories;
      else if (label === 'Песни') target = routes.songs;
      else if (label === 'Автор') target = routes.author;

      if (!target) return;

      el.addEventListener('click', (e) => {
        // Если это <a>, не даём браузеру идти по относительному href (который и даёт 404)
        e.preventDefault();
        e.stopPropagation();
        window.location.href = target;
      });
    });
  }

  // 4) Клик по фону -> на главную
  function bindBackgroundClick() {
    document.addEventListener('click', (e) => {
      const nav = document.querySelector('.main-nav');
      const readingPanel = document.querySelector('.reading-panel');
      const scrollPanel = document.querySelector('.scroll-panel');

      if (nav && nav.contains(e.target)) return;
      if (readingPanel && readingPanel.contains(e.target)) return;
      if (scrollPanel && scrollPanel.contains(e.target)) return;

      window.location.href = routes.home;
    });
  }

  // Старт
  bindMenu();
  bindBackgroundClick();
})();
