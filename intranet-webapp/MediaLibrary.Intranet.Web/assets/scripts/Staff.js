import { setAdminNav } from './DisplayAdminNav'
import { processDisplayName } from './DisplayName.js'

setAdminNav("staff")


//Variables ------------
let url;

let searchBtn = document.getElementById("searchBtn")
let tableBody = document.getElementById("staffTableBody")
let searchBar = document.getElementById("searchBar")
let refreshTableBtn = document.getElementById("refreshTableBtn")

let paginationUL = document.getElementsByClassName('paginationUL')
const paginationPrev = document.getElementsByClassName('paginationPrev')
const paginationNext = document.getElementsByClassName('paginationNext')
const paginationPrevA = document.getElementsByClassName('paginationPrevA')
const paginationNextA = document.getElementsByClassName('paginationNextA')
const paginationErr = document.getElementsByClassName('paginationErr')


//Mini Functions -------------------
function getActivityReportURL(email) {
  url = `/Dashboard/StaffActivityReport?email=${email}`
  return `<div class="dropdown show"><a id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /></svg></a ><div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink"><a class="dropdown-item" id="test" href=${url}>Activity Report</a><a class="dropdown-item">Generate Excel</a></div></div>`
}

function search() {
  //Clear table body
  tableBody.innerHTML = ""

  url = retrieveURL(1, searchBar.value)
  retrieveAllStaff(url)
}

function displayPagination(totalpage, currentPage) {
  displayPaginationByElement(totalpage, currentPage, paginationUL[0], paginationPrev[0], paginationNext[0], paginationPrevA[0], paginationNextA[0])
  displayPaginationByElement(totalpage, currentPage, paginationUL[1], paginationPrev[1], paginationNext[1], paginationPrevA[1], paginationNextA[1])
}

function displayPaginationByElement(totalpage, currentPage, paginationUL, paginationPrev, paginationNext, paginationPrevA, paginationNextA) {
  let maxPageShow = 5
  let i = 1;
  let pageArr = []
  if (currentPage == 1) {
    for (i = 1; i <= maxPageShow && i <= totalpage; i++) {
      pageArr.push(i)
    }
    if (pageArr.at(-1) != totalpage) {
      pageArr.push("...")
      pageArr.push(totalpage)
    }
  }
  else if (currentPage == totalpage) {
    for (i = totalpage - maxPageShow + 1; pageArr.length < maxPageShow && i <= totalpage; i++) {
      if (i <= 0) {
        continue
      }
      pageArr.push(i)
    }

    if (pageArr.at(0) != 1) {
      if (pageArr[0] != 1) {
        pageArr.unshift(1, "...")
      }
    }
  }
  else {
    i = currentPage - 2
    for (let j = Math.floor(maxPageShow / 2); j > 0; j--) {
      if (i != 0) {
        pageArr.push(i)
      }
      i++
    }
    i = currentPage
    for (let j = Math.floor(maxPageShow / 2); j >= 0; j--) {
      pageArr.push(i)
      if (i == totalpage) {
        break
      }
      i++
    }
    if (pageArr[0] - 1 == 1) {
      pageArr.unshift(1)
    }
    else if (pageArr[0] != 1) {
      pageArr.unshift(1, "...")
    }
    if (pageArr.at(-1) + 1 == totalpage) {
      pageArr.push(totalpage)
    }
    else if (pageArr.at(-1) != totalpage) {
      pageArr.push("...")
      pageArr.push(totalpage)
    }
  }
  for (i = 0; i < pageArr.length; i++) {
    let li = document.createElement("li")
    li.classList.add("page-item")
    let a = document.createElement("a")
    a.classList.add("page-link")
    a.classList.add("page-number")
    a.innerHTML = pageArr[i]
    if (pageArr[i] == "...") {
      a.style.pointerEvents = 'none'
      a.classList.add('bg-light')
      a.classList.add('text-muted')
    }
    a.href = "#"
    if (pageArr[i] == currentPage) {
      li.classList.add("active")
      a.classList.add("active-page-no")
      a.style.pointerEvents = "none";
    }
    paginationPrev.style.pointerEvents = "auto"
    paginationNext.style.pointerEvents = "auto"
    paginationPrevA.classList.remove('bg-light')
    paginationPrevA.classList.remove('text-muted')
    paginationNextA.classList.remove('bg-light')
    paginationNextA.classList.remove('text-muted')
    if (currentPage == 1) {
      paginationPrev.style.pointerEvents = "none"
      paginationPrevA.classList.add('bg-light')
      paginationPrevA.classList.add('text-muted')
    }
    if (currentPage == totalpage) {
      paginationNext.style.pointerEvents = "none"
      paginationNextA.classList.add('bg-light')
      paginationNextA.classList.add('text-muted')
    }

    li.appendChild(a)
    paginationUL.insertBefore(li, paginationNext)
  }
}

function disableClicks() {
  $(".page-number").remove()
  searchBar.disabled = true;
  searchBtn.disabled = true;
  refreshTableBtn.style.pointerEvents = 'none'
}

function enableClicks() {
  searchBar.disabled = false;
  searchBtn.disabled = false;
  refreshTableBtn.style.pointerEvents = 'auto'
}


//Render data -----------------
function retrieveURL(page, searchQuery) {
  disableClicks()

  const baseLocation = location
  let url = new URL('/api/staff', baseLocation)

  const params = {
    Page: page,
    SearchQuery: searchQuery
  }

  url.search = new URLSearchParams(params)

  return fetch(url, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })
}

function retrieveAllStaff(data) {
  data
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
      }
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!")
      }
      return response.json()
    })
    .then((data) => {
      if (data.Item1.length == 0) {
        setTimeout(() => {
          paginationErr[0].innerHTML = "No result found"
          paginationErr[1].innerHTML = "No result found"
        }, 2000)
      } else {
        paginationErr[0].innerHTML = ""
        paginationErr[1].innerHTML = ""
      }
      GetDisplayName(data.Item1)
      displayPagination(data.Item2, data.Item3)
    })
    .catch((error) => {
      console.log("Error: " + error);
    })
}

async function GetDisplayName(data) {
  let nameArr = []
  data.forEach(x => {
    let dict = { "author": x["Email"] }
    nameArr.push(dict)
  })
  await processDisplayName(nameArr)
  setTimeout(() => {
      renderTable(data)
      enableClicks()
  }, 1000)
}

function renderTable(data) {
  const table = document.getElementById("staffTableBody")
  data.forEach(result => {
    let row = table.insertRow(-1)
    let cell1 = row.insertCell(0)
    let cell2 = row.insertCell(1)
    let cell3 = row.insertCell(2)
    let cell4 = row.insertCell(3)
    let cell5 = row.insertCell(4)

    cell1.classList.add("p-2")
    cell2.classList.add("p-2")
    cell3.classList.add("p-2")
    cell4.classList.add("p-2")
    cell5.classList.add("p-2")

    cell1.innerHTML = localStorage.getItem(result["Email"])
    cell2.innerHTML = result["Email"]
    cell3.innerHTML = result["UploadCount"]
    cell4.innerHTML = result["DownloadCount"]
    cell5.innerHTML = getActivityReportURL(result["Email"])
  })
}


//Event Listener -------------------
searchBtn.addEventListener('click', function () {
  search()
  
})

searchBar.addEventListener('keypress', function(e) {
  if (e.keyCode == 13 || e.key === "Enter") {
    search()
  }
})

$(document).on  ("click", '.page-link', "a", function (e) {
  //Clear Table Body
  tableBody.innerHTML = ""
  let page = document.getElementsByClassName("active-page-no")[0].innerHTML

  if (e.target.innerHTML == "Next") {
    page = parseInt(page) + 1
  }
  else if (e.target.innerHTML == "Previous") {
    page = parseInt(page) - 1
  }
  else {
    page = e.target.innerHTML
  }

  url = retrieveURL(page, searchBar.value)
  retrieveAllStaff(url)
})

refreshTableBtn.addEventListener('click', function () {
  //Clear table body
  tableBody.innerHTML = ""

  const page = document.getElementsByClassName("active-page-no")[0].innerHTML

  url = retrieveURL(page, searchBar.value)
  retrieveAllStaff(url)
})


//Function call --------------------
url = retrieveURL(1, "")
retrieveAllStaff(url)
