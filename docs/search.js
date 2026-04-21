/*
========================================
ПОИСК ПО CATALOG.JSON
========================================
*/

let CATALOG = []

const input =
  document.getElementById("searchInput")

const resultsBox =
  document.getElementById("searchResults")

const infoBox =
  document.getElementById("searchInfo")

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
ОБЩАЯ СТРОКА ДЛЯ ПОИСКА
========================================
*/

function makeSearchText(item) {

  return normalize(
    [
      item.title,
      item.place,
      item.year,
      item.style,
      Array.isArray(item.tags)
        ? item.tags.join(" ")
        : ""
    ].join(" ")
  )

}

/*
========================================
ПОИСК
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
ОТРИСОВКА РЕЗУЛЬТАТОВ
========================================
*/

function renderResults(list) {

  if (!resultsBox)
    return

  resultsBox.innerHTML = ""

  if (!list.length) {
    setInfo("Ничего не найдено")
    return
  }

  setInfo("Найдено: " + list.length)

  list.forEach(item => {

    const a =
      document.createElement("a")

    a.href =
      item.file

    a.className =
      "search-item"

    const meta = [
      safe(item.section),
      safe(item.place),
      safe(item.year),
      safe(item.style)
    ]
    .filter(Boolean)
    .join(" | ")

    const tags =
      Array.isArray(item.tags)
        ? item.tags.join(", ")
        : ""

    a.innerHTML = `
      <div class="search-title">${safe(item.title)}</div>
      <div class="search-meta">${meta}</div>
      <div class="search-tags">${tags}</div>
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
    resultsBox.innerHTML = ""

  setInfo(
    "Введите слово для поиска"
  )

}

/*
========================================
ОБРАБОТКА ВВОДА
========================================
*/

function handleSearch() {

  const query =
    input.value

  if (!query.trim()) {
    clearResults()
    return
  }

  const found =
    searchCatalog(query)

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

  if (input) {
    input.addEventListener("input", handleSearch)
  }

})
