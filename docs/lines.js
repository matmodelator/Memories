

// Глобальный массив для effect.js
window.MEMORY_LINES = [];

document.addEventListener("DOMContentLoaded", async function () {

  

// Индикатор текущего файла (правый верхний угол)
(function () {

  const indicator = document.createElement("div");

  indicator.style.position = "fixed";
  indicator.style.top = "10px";
  indicator.style.right = "10px";
  indicator.style.zIndex = "99999";
  indicator.style.background = "rgba(0,0,0,0.78)";
  indicator.style.color = "#fff";
  indicator.style.padding = "6px 10px";
  indicator.style.fontFamily = "monospace";
  indicator.style.fontSize = "13px";
  indicator.style.borderRadius = "6px";

  indicator.textContent = "—";

  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(indicator);
  });

  const originalFetch = window.fetch;

  window.fetch = async function () {
    try {
      const path = arguments[0];

      if (typeof path === "string") {
        indicator.textContent = path;
      }

    } catch (e) {}

    return originalFetch.apply(this, arguments);
  };

})();
  
  // ==================================================
  // 1. СПИСОК текстов для Парсера resume
  // ==================================================

  const POEM_TABLE_HTML = `
    <a class="scroll-link" href="poems/poem_50.html">50 лет и один вечер</a>
    <a class="scroll-link" href="poems/poem_al.html">Алаверда</a>
    <a class="scroll-link" href="poems/poem_ath.html">Афтаркия</a>
    <a class="scroll-link" href="poems/poem_ba1.html">Барахас. Дождь. Кончается февраль.</a>
    <a class="scroll-link" href="poems/poem_ba2.html">Барахтаюсь в Барахасе как сом</a>
    <a class="scroll-link" href="poems/poem_bve.html">Век одиночества</a>
    <a class="scroll-link" href="poems/poem_bvo1.html">Вот Вена, полночь, Австрия, ручей</a>
    <a class="scroll-link" href="poems/poem_bvo2.html">Вот дождь на озере</a>
    <a class="scroll-link" href="poems/poem_bvo3.html">Вот и всё.. Ни тоски, ни печали</a>
    <a class="scroll-link" href="poems/poem_bvs1.html">Всё кончено. Твой статус - не в сети</a>
    <a class="scroll-link" href="poems/poem_bvs2.html">Всё плохо, Булочка!</a>
    <a class="scroll-link" href="poems/poem_b1.html">В небывалых девяностых</a>
    <a class="scroll-link" href="poems/poem_b2.html">В хурмяном саду декабрь</a>
    <a class="scroll-link" href="poems/poem_b3.html">В центре мира и на краю земли</a>
    <a class="scroll-link" href="poems/poem_b4.html">В чужой земле</a>
    <a class="scroll-link" href="poems/poem_cga.html">Гарнизонная тоска</a>
    <a class="scroll-link" href="poems/poem_de9.html">Девятый май</a>
    <a class="scroll-link" href="poems/poem_de.html">День осенний</a>
    <a class="scroll-link" href="poems/poem_dn.html">Дни проходят как в тумане</a>
    <a class="scroll-link" href="poems/poem_do.html">Дом опустел</a>
    <a class="scroll-link" href="poems/poem_ed.html">Едва мерцают стылые огни</a>
    <a class="scroll-link" href="poems/poem_ge.html">Жёлтый мустанг</a>
    <a class="scroll-link" href="poems/poem_hzd.html">Здравстуй, рай пятиэтажек</a>
    <a class="scroll-link" href="poems/poem_hzi.html">Зима которую неделю...</a>
    <a class="scroll-link" href="poems/poem_is.html">Испанский жёлтый свет</a>
    <a class="scroll-link" href="poems/poem_iz.html">Из писем Белле</a>
    <a class="scroll-link" href="poems/poem_ka.html">Канары. Август.</a>
    <a class="scroll-link" href="poems/poem_ki.html">Кипур</a>
    <a class="scroll-link" href="poems/poem_kl.html">Кляксы</a>
    <a class="scroll-link" href="poems/poem_ko.html">Когда мы встретимся</a>
    <a class="scroll-link" href="poems/poem_ku.html">Куда бежать мне?</a>
    <a class="scroll-link" href="poems/poem_kx.html">Кхалисси</a>
    <a class="scroll-link" href="poems/poem_lu.html">Любовь моя, так хочется на волю!..</a>
    <a class="scroll-link" href="poems/poem_ma.html">Мама, ты постой еще немного</a>
    <a class="scroll-link" href="poems/poem_mi.html">Мир сузился до ширины зрачка...</a>
    <a class="scroll-link" href="poems/poem_mo.html">Москва уходит задними дворами</a>
    <a class="scroll-link" href="poems/poem_mn.html">Мне кажется порой</a>
    <a class="scroll-link" href="poems/poem_na.html">На Средиземном третье апреля</a>
    <a class="scroll-link" href="poems/poem_no1.html">Ночи зимой длинны.</a>
    <a class="scroll-link" href="poems/poem_no2.html">Ноябрь.. Сомнения</a>
    <a class="scroll-link" href="poems/poem_o1.html">О нетленной любви</a>
    <a class="scroll-link" href="poems/poem_od11.html">Одиннадцатистишья</a>
    <a class="scroll-link" href="poems/poem_od.html">Одуванчики</a>
    <a class="scroll-link" href="poems/poem_oi.html">Ой ты гой еси!..</a>
    <a class="scroll-link" href="poems/poem_op.html">Опять ноябрь</a>
    <a class="scroll-link" href="poems/poem_pe.html">Пёсья рыжь</a>
    <a class="scroll-link" href="poems/poem_pi.html">Пилат</a>
    <a class="scroll-link" href="poems/poem_po.html">Пока еще не сделалась беда</a>
    <a class="scroll-link" href="poems/poem_pre.html">Предчувствие</a>
    <a class="scroll-link" href="poems/poem_pro.html">Проезжая Литву</a>
    <a class="scroll-link" href="poems/poem_pro1.html">Прощай!</a>
    <a class="scroll-link" href="poems/poem_pro2.html">Прощания</a>
    <a class="scroll-link" href="poems/poem_pro3.html">Прощаюсь с озером</a>
    <a class="scroll-link" href="poems/poem_seb.html">Севастопольский вальс</a>
    <a class="scroll-link" href="poems/poem_sem.html">Семистишья</a>
    <a class="scroll-link" href="poems/poem_sen.html">Сентябрь в Далии</a>
    <a class="scroll-link" href="poems/poem_si.html">Сидел в тайге мужик</a>
    <a class="scroll-link" href="poems/poem_sm.html">Смеркается Испания у ног</a>
    <a class="scroll-link" href="poems/poem_sn.html">Снова дождь</a>
    <a class="scroll-link" href="poems/poem_sp.html">Спят усталые солдаты</a>
    <a class="scroll-link" href="poems/poem_st1.html">Старик и море - 1</a>
    <a class="scroll-link" href="poems/poem_st2.html">Старик и море - 2</a>
    <a class="scroll-link" href="poems/poem_st3.html">Старик и море - 3</a>
    <a class="scroll-link" href="poems/poem_su.html">Сумрак в комнате</a>
    <a class="scroll-link" href="poems/poem_ta.html">Там любил я</a>
    <a class="scroll-link" href="poems/poem_te.html">Теперь я часто думаю о том</a>
    <a class="scroll-link" href="poems/poem_to.html">То ли море шумит</a>
    <a class="scroll-link" href="poems/poem_ty.html">Ты мне вослед, прошу не сквернословь</a>
    <a class="scroll-link" href="poems/poem_thl.html">Флоренция</a>
    <a class="scroll-link" href="poems/poem_tsc1.html">Четыре года времени</a>
    <a class="scroll-link" href="poems/poem_tsc2.html">Что позади..</a>
    <a class="scroll-link" href="poems/poem_ue.html">Эвкалипты шумят тополями</a>
    <a class="scroll-link" href="poems/poem_ya1.html">Я б...</a>
    <a class="scroll-link" href="poems/poem_ya2.html">Я как спившийся командарм</a>
    <a class="scroll-link" href="poems/poem_ya3.html">Я тщусь понять</a>
    <a class="scroll-link" href="poems/poem_yan.html">Январи</a>
  <a class="scroll-link" href="/songs/all_good.html">Всё ОК (All good)</a>
  <a class="scroll-link" href="/songs/fly.html">Жёлтая муха тоски (Fly)</a>
  <a class="scroll-link" href="/songs/korona.html">Коронавирь (Korona)</a>   
  <a class="scroll-link" href="/songs/no_hide_face.html">Не пряча лица (No hide face)</a>    
  <a class="scroll-link" href="/songs/we_were_no.html">Шампанское!.. (We were no)</a>
  `;

  // ==================================================
  // 2. ПАРСИМ HTML
  // ==================================================

  const parser = new DOMParser();
  const doc = parser.parseFromString(POEM_TABLE_HTML, "text/html");

  const links = [...doc.querySelectorAll("a.scroll-link")];
  const pages = links.map(function (a) {
    return a.getAttribute("href");
  });

  // ==================================================
  // 3. ЧИТАЕМ ФАЙЛЫ
  // ==================================================

  const collected = [];
  let resumeCount = 0;

  for (const path of pages) {
    try {
      const response = await fetch(path);
      if (!response.ok) continue;

      const pageHtml = await response.text();

      const match = pageHtml.match(/resume\s*:\s*`([\s\S]*?)`\s*,?/);

      if (!match) continue;

      resumeCount++;

      const resumeText = match[1];

      // без фильтров вообще
      const lines = resumeText.split("\n");

      collected.push(...lines);

    } catch (e) {}
  }

  // ==================================================
  // 4. ПЕРЕМЕШИВАЕМ
  // ==================================================

  window.MEMORY_LINES = collected.sort(function () {
    return Math.random() - 0.5;
  });

  // ==================================================
  // 5. СИГНАЛ
  // ==================================================

  window.dispatchEvent(new Event("memoryLinesReady"));

  // ==================================================
  // 6. СЧЁТЧИК НА ЭКРАН
  // ==================================================

  document.body.insertAdjacentHTML(
    "beforeend",
    "<div id='lines-counter' style='position:fixed;bottom:10px;left:10px;z-index:99999;background:rgba(0,0,0,0.72);color:#fff;padding:8px 10px;font-size:14px;border-radius:6px;font-family:monospace'>" +
    "pages: " + pages.length + "<br>" +
    "resume: " + resumeCount + "<br>" +
    "lines: " + collected.length +
    "</div>"
  );

});

