/*
========================================
добавлен РАСШИРЕННЫЙ поиск /2.0.0
========================================
*/




/*
========================================
ПОИСК ПО CATALOG.JSON
БЫСТРЫЙ / РАСШИРЕННЫЙ
========================================
*/

let CATALOG = []

let TEXT_INDEX = {}
let textIndexReady = false

let searchMode =
  "fast"

const input =
  document.getElementById("searchInput")

const resultsBox =
  document.getElementById("searchResults")

const infoBox =
  document.getElementById("searchInfo")

const fastSearchBtn =
  document.getElementById("fastSearchBtn")

const advancedSearchBtn =
  document.getElementById("advancedSearchBtn")

const searchDescription =
  document.getElementById("searchDescription")

/*
========================================
ЗАГРУЗКА КАТАЛОГА
========================================
*/

async function loadCatalog() {

  try {

    const res =
      await fetch("catalog.json", {
        cache: "no-store"
      })

    if (!res.ok) {
      throw new Error("catalog.json не найден")
    }

    CATALOG =
      await res.json()

    setInfo(
      "Каталог загружен: " +
      CATALOG.length
    )

  }

  catch (e) {

    setInfo(
      "Ошибка загрузки catalog.json"
    )

    console.error(e)

  }

}

/*
========================================
ТЕКСТ В ИНФО
========================================
*/

function setInfo(text) {

  if (infoBox)
    infoBox.textContent = text

}

/*
========================================
БЕЗОПАСНАЯ СТРОКА
========================================
*/

function safe(value) {
  return String(value || "").trim()
}

/*
========================================
НОРМАЛИЗАЦИЯ
========================================
*/

function normalize(value) {

  return String(value || "")
    .toLowerCase()
    .replace(/\u00A0/g, " ")
    .replace(/[.,:;!?()[\]{}"'`«»—–/\\|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

}

/*
========================================
ОБЩАЯ СТРОКА ДЛЯ БЫСТРОГО ПОИСКА
========================================
*/

function makeSearchText(item) {

  return normalize(
    [
      item.title,
      item.place,
      item.year,
      item.style,
      item.section,
      item.line,
      Array.isArray(item.tags)
        ? item.tags.join(" ")
        : ""
    ].join(" ")
  )

}

/*
========================================
ИЗВЛЕЧЕНИЕ ТОЛЬКО ТЕКСТА ПРОИЗВЕДЕНИЯ
ИЗ window.poem.text
========================================
*/

function extractPoemText(html) {

  const match =
    String(html || "").match(
      /text\s*:\s*`([\s\S]*?)`/
    )

  if (!match)
    return ""

  return match[1]

}

/*
========================================
ПЕРЕКЛЮЧЕНИЕ РЕЖИМА ПОИСКА
========================================
*/

function updateSearchMode() {

  if (!input)
    return

  if (searchMode === "fast") {

    input.placeholder =
      "название, место, год, стиль, тег"

    if (searchDescription) {
      searchDescription.textContent =
        "Быстрый поиск по тегам"
    }

    if (fastSearchBtn)
      fastSearchBtn.classList.add("active")

    if (advancedSearchBtn)
      advancedSearchBtn.classList.remove("active")

  }

  else {

    input.placeholder =
      "слово или фраза из текста"

    if (searchDescription) {
      searchDescription.textContent =
        "Расширенный поиск по текстам"
    }

    if (fastSearchBtn)
      fastSearchBtn.classList.remove("active")

    if (advancedSearchBtn)
      advancedSearchBtn.classList.add("active")

  }

}

/*
========================================
БЫСТРЫЙ ПОИСК ПО CATALOG.JSON
========================================
*/

function searchCatalog(query) {

  const q =
    normalize(query)

  if (!q)
    return []

  const words =
    q.split(" ").filter(Boolean)

  return CATALOG.filter(item => {

    const haystack =
      makeSearchText(item)

    return words.every(word =>
      haystack.includes(word)
    )

  })

}

/*
========================================
ЗАГРУЗКА ТЕКСТОВ ИЗ ФАЙЛОВ
ТОЛЬКО window.poem.text
========================================
*/

async function buildTextIndex() {

  if (textIndexReady)
    return

  setInfo("Загрузка текстов...")

  for (const item of CATALOG) {

    if (!item.file)
      continue

    try {

      const res =
        await fetch(item.file, {
          cache: "no-store"
        })

      if (!res.ok)
        continue

      const html =
        await res.text()

      const poemText =
        extractPoemText(html)

      TEXT_INDEX[item.file] =
        normalize(poemText)

    }

    catch (e) {

      console.warn(
        "Не удалось загрузить файл:",
        item.file,
        e
      )

    }

  }

  textIndexReady =
    true

}

/*
========================================
РАСШИРЕННЫЙ ПОИСК ПО ТЕКСТАМ ФАЙЛОВ
========================================
*/

async function searchTexts(query) {

  await buildTextIndex()

  const q =
    normalize(query)

  if (!q)
    return []

  const words =
    q.split(" ").filter(Boolean)

  return CATALOG.filter(item => {

    const fileText =
      TEXT_INDEX[item.file] || ""

    return words.every(word =>
      fileText.includes(word)
    )

  })

}

/*
========================================
СОРТИРОВКА ПО ГОДУ
НОВЫЕ СВЕРХУ
========================================
*/

function sortByYear(list) {

  return list.sort(function(a, b) {

    const yearA =
      parseInt(a.year) || 0

    const yearB =
      parseInt(b.year) || 0

    return yearB - yearA

  })

}

/*
========================================
ПОДСВЕТКА СЛОВ
========================================
*/

function highlight(text, query) {

  if (!query)
    return safe(text)

  const words =
    query
      .toLowerCase()
      .split(" ")
      .filter(Boolean)

  let result =
    String(text || "")

  words.forEach(function(word) {

    const escapedWord =
      word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    const re =
      new RegExp(
        "(" + escapedWord + ")",
        "gi"
      )

    result =
      result.replace(
        re,
        '<span class="search-highlight">$1</span>'
      )

  })

  return result

}

/*
========================================
ОТРИСОВКА РЕЗУЛЬТАТОВ
========================================
*/

function renderResults(list) {

  list =
    sortByYear(list)

  if (!resultsBox)
    return

  resultsBox.innerHTML =
    ""

  if (!list.length) {
    setInfo("Ничего не найдено")
    return
  }

  setInfo(
    "Найдено: " +
    list.length
  )

  const query =
    input ? input.value : ""

  list.forEach(item => {

    const a =
      document.createElement("a")

    a.href =
      item.file

    a.className =
      "search-item"

    const yearPlace = [
      safe(item.year),
      safe(item.place)
    ]
      .filter(Boolean)
      .join(" | ")

    const sectionStyle = [
      safe(item.section),
      safe(item.style)
    ]
      .filter(Boolean)
      .join(" | ")

    const firstLine =
      safe(item.line)

    a.innerHTML = `

      <div class="search-title">
        ${highlight(
          safe(item.title),
          query
        )}
      </div>

      <div class="search-line">
        ${highlight(
          firstLine,
          query
        )}
      </div>

      <div class="search-meta">
        ${highlight(
          yearPlace,
          query
        )}
      </div>

      <div class="search-meta">
        ${highlight(
          sectionStyle,
          query
        )}
      </div>

    `

    resultsBox.appendChild(a)

  })

}

/*
========================================
ОЧИСТКА РЕЗУЛЬТАТОВ
========================================
*/

function clearResults() {

  if (resultsBox)
    resultsBox.innerHTML =
      ""

  setInfo(
    "Введите слово для поиска"
  )

}

/*
========================================
ОБРАБОТКА ВВОДА
========================================
*/

async function handleSearch() {

  if (!input)
    return

  const query =
    input.value

  if (!query.trim()) {
    clearResults()
    return
  }

  let found =
    []

  if (searchMode === "advanced") {

    found =
      await searchTexts(query)

  }

  else {

    found =
      searchCatalog(query)

  }

  renderResults(found)

}

/*
========================================
СТАРТ
========================================
*/

document.addEventListener("DOMContentLoaded", async function () {

  await loadCatalog()

  clearResults()

  updateSearchMode()

  if (input) {

    input.addEventListener(
      "input",
      handleSearch
    )

  }

  if (fastSearchBtn) {

    fastSearchBtn.addEventListener(
      "click",
      function () {

        searchMode =
          "fast"

        updateSearchMode()

        handleSearch()

      }
    )

  }

  if (advancedSearchBtn) {

    advancedSearchBtn.addEventListener(
      "click",
      function () {

        searchMode =
          "advanced"

        updateSearchMode()

        handleSearch()

      }
    )

  }

})
