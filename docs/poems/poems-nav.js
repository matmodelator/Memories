document.addEventListener("DOMContentLoaded", async function(){

  const current = location.pathname.split("/").pop()

  const res = await fetch("../poems.html")
  const text = await res.text()

  const parser = new DOMParser()
  const doc = parser.parseFromString(text,"text/html")

  const links = [...doc.querySelectorAll("a[href*='poem']")]

  const files = links.map(a=>a.getAttribute("href"))

  const index = files.indexOf(current)

  const prev = files[index-1]
  const next = files[index+1]

  let html = '<div class="poems-nav">'

  if(prev)
    html += `<a href="${prev}">🔼</a>`

  if(next)
    html += `<a href="${next}">🔽</a>`

  html += '</div>'

  document.getElementById("poems-nav").innerHTML = html

})
