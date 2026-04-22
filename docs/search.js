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

list = sortByYear(list)
  
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

const query =
  input.value

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
    return text

  const words =
    query
      .toLowerCase()
      .split(" ")
      .filter(Boolean)

  let result =
    String(text)

  words.forEach(function(word) {

    const re =
      new RegExp(
        "(" + word + ")",
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
