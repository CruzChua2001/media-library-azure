import { setAdminNav } from './DisplayAdminNav'
import { formatDateOnly, formatTimeOnly } from './format.js'
import { processDisplayName } from './DisplayName.js'
import { parseISO } from 'date-fns'

setAdminNav("dashboard")

//Variables ------------------------------------------------

let dateASC = document.getElementById("dateASC")
let dateDSC = document.getElementById("dateDSC")
let sortDetail = document.querySelector("#sortDetail")

let planningAreaDD = document.getElementById("planningAreaDropDown")
let datePeriodDD = document.getElementById("datePeriodDropDown")
let sortingDD = document.getElementById("sortingDropDown")

const allFilterOption = document.getElementById("allFilterOption")
const uploadFilterOption = document.getElementById("uploadFilterOption")
const downloadFilterOption = document.getElementById("downloadFilterOption")

const tableBody = document.getElementById("activityTableBody")
let allPlanningArea = document.getElementById("allPlanningArea")
let planningAreaSelected = document.getElementById("planningAreaSelected")
let datePeriodSelected = document.getElementById("datePeriodSelected")
const startDate = document.querySelector('#startDate')
const endDate = document.querySelector('#endDate')
const dateErrMsg = document.querySelector('#dateErrMsg')
const resetDateBtn = document.querySelector('#resetDateBtn')
let paginationUL = document.getElementsByClassName('paginationUL')
const paginationPrev = document.getElementsByClassName('paginationPrev')
const paginationNext = document.getElementsByClassName('paginationNext')
const paginationPrevA = document.getElementsByClassName('paginationPrevA')
const paginationNextA = document.getElementsByClassName('paginationNextA')

let url;


//Retrieve data ------------------------------------------------
function convertActivityOption(activityOption) {
  switch (activityOption) {
    case "allFilterOption":
      return 0
    case "uploadFilterOption":
      return 2
    case "downloadFilterOption":
      return 3
  }
}

function retrieveDefaultURL(activityOption, sortOption, planningArea, startDate, endDate, page) {
  disableClicks()
  displaySortFilter(sortOption)

  planningAreaSelected.innerHTML = planningArea
  if (startDate != "" && endDate != "") {
    datePeriodSelected.innerHTML = `${parseAndFormatDate(startDate)} to ${parseAndFormatDate(endDate)}`
  }
  else {
    datePeriodSelected.innerHTML = "Any Time"
  }

  const baseLocation = location
  let url = new URL('/api/activityreport', baseLocation)

  const params = {
    ActivityOption: convertActivityOption(activityOption),
    SortOption: sortOption,
    PlanningArea: planningArea,
    StartDate: startDate,
    EndDate: endDate,
    Page: page,
    Email: ""
  }

  url.search = new URLSearchParams(params)

  return fetch(url, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })
}


//Render table ------------------------------------------------
function renderActivityData(data) {
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
    .then((result) => {
      getDisplayName(result.Item1, result.Item2, result.Item3)
    })
    .catch((error) => {
      console.log("Error: " + error);
    })
}

function getDisplayName(data, totalPage, currPage) {
  let paginationErr = document.getElementsByClassName('paginationErr')
  if (data.length == 0) {
    setTimeout(() => {
      paginationErr[0].innerHTML = "No result found"
      paginationErr[1].innerHTML = "No result found"
    }, 2000)
  } else {
    paginationErr[0].innerHTML = ""
    paginationErr[1].innerHTML = ""
  }

  updateDisplayName(data)

  setTimeout(() => {
    updateActivityData(data)
    displayPagination(totalPage, currPage)
    enableClicks()
  }, 1500)
  
}

async function updateDisplayName(item) {
  let nameArr = []
  item.forEach(x => {
    let dict = { "author": x["Email"] }
    nameArr.push(dict)
  })
  await processDisplayName(nameArr)
}

function updateActivityData(data) {
  data.forEach(item => {
    let location = "No Geotag"
    if (item.Location.length != 0) {
      location = item.Location[0]
    }
    const table = document.getElementById("activityTableBody")
    let row = table.insertRow(-1)
    let cell1 = row.insertCell(0)
    let cell2 = row.insertCell(1)
    let cell3 = row.insertCell(2)
    let cell4 = row.insertCell(3)
    let cell5 = row.insertCell(4)
    let cell6 = row.insertCell(5)

    let a = document.createElement("a")
    a.href = '/gallery/item/' + item.FileId
    a.target = '_blank'
    let img = document.createElement("img")
    img.src = item.ThumbnailURL
    img.height = "80"
    img.width = "90"
    a.appendChild(img)

    cell1.appendChild(a)
    if (localStorage.getItem(item.Email)) {
      cell3.innerHTML = localStorage.getItem(item.Email)
    }
    else {
      cell3.innerHTML = ""
    }
    cell2.innerHTML = location
    cell4.innerHTML = item.Email
    cell5.innerHTML = `${formatDateOnly(item.ActivityDateTime)} ${formatTimeOnly(item.ActivityDateTime)}`
    cell5.style.whiteSpace = "nowrap"
    cell6.innerHTML = item.ActivityType
  })
} 

function displayPagination(totalpage, currentPage) {
  $(".page-number").remove()
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


  
//Mini Functions --------------------------------------
function displaySortFilter(sortOption) {
  if (sortOption == "dateDSC") {
    sortDetail.innerHTML = dateDSC.innerHTML
    dateDSC.style.backgroundColor = "#e3e6e4"
    dateASC.style.backgroundColor = "#FFFFFF"
    sortDetail.removeAttribute("class")
    sortDetail.classList.add("dateDSC")
  }
  else if (sortOption == "dateASC") {
    sortDetail.innerHTML = dateASC.innerHTML
    dateASC.style.backgroundColor = "#e3e6e4"
    dateDSC.style.backgroundColor = "#FFFFFF"
    sortDetail.removeAttribute("class")
    sortDetail.classList.add("dateASC")
  }
}

function getRegionName(regionId) {
  switch (parseInt(regionId)) {
    case 1:
      return "North Region"
    case 2:
      return "East Region"
    case 3:
      return "West Region"
    case 4:
      return "Central Region"
    case 5:
      return "North-East Region"
    case 6:
      return "Central Area"
  }
}

function planningAreaDropDown() {
  fetch('/api/planningarea', {
    mode: 'same-origin',
    credentials: 'same-origin',
  })
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
      let p_area = []
      let all_region_id = []
      //Insert data into select
      data.forEach(e => {
        const planningAreaName = e["PlanningAreaName"].trim()

        let regionId = e["RegionId"]
        if (regionId == 4 && e["CA_IND"] == 1) {
          regionId = 6
        }

        if (!all_region_id.includes(regionId)) {
          all_region_id.push(regionId)
        }

        let area = {}
        area[regionId] = planningAreaName
        p_area.push(area)
      })


      let a = document.createElement("a")
      a.classList.add("dropdown-item")
      a.classList.add("planning-area-item")
      a.classList.add("pl-2")
      if (planningAreaSelected.innerHTML == "ALL") {
        a.style.backgroundColor = "rgb(227, 230, 228)"
      }
      a.innerHTML = "ALL"
      allPlanningArea.appendChild(a)
      for (let i = 0; i < all_region_id.length; i++) {
        let h6 = document.createElement("h6")
        h6.classList.add("dropdown-header")
        h6.classList.add("planning-area-header")
        h6.classList.add("pl-2")
        h6.innerHTML = getRegionName(all_region_id[i])
        allPlanningArea.appendChild(h6)

        for (let j = 0; j < p_area.length; j++) {
          if (Object.keys(p_area[j]) == all_region_id[i]) {
            a = document.createElement("a")
            a.classList.add("dropdown-item")
            a.classList.add("planning-area-item")
            if (Object.values(p_area[j]) == planningAreaSelected.innerHTML) {
              a.style.backgroundColor = "rgb(227, 230, 228)"
            }
            a.innerHTML = Object.values(p_area[j])
            allPlanningArea.appendChild(a)
          }
        }
      }
    })
    .catch((error) => {
      console.log("Error: " + error);
    })
}

function setOptionActive(filterOptionActive, filterOptions) {
  filterOptionActive.classList.add("filter-option-active")
  filterOptions.forEach(filterOption => {
    filterOption.classList.remove("filter-option-active")
  })
}

function filterDate() {
  //Clear table body
  tableBody.innerHTML = ""

  //Underline the "All" option filter
  setOptionActive(allFilterOption, [uploadFilterOption, downloadFilterOption])

  url = retrieveDefaultURL("allFilterOption", sortDetail.classList.value,  planningAreaSelected.innerHTML, startDate.value, endDate.value, 1)
  renderActivityData(url)
}

function disableClicks() {
  $(".page-number").remove()
  refreshTableBtn.disabled = true
  allFilterOption.style.pointerEvents = 'none'
  uploadFilterOption.style.pointerEvents = 'none'
  downloadFilterOption.style.pointerEvents = 'none'
  startDate.disabled = true
  endDate.disabled = true
  resetDateBtn.disabled = true
  planningAreaDD.disabled = true
  datePeriodDD.disabled = true
  sortingDD.disabled = true
  resetDateBtn.style.pointerEvents = 'none'
}

function enableClicks() {
  refreshTableBtn.disabled = false
  allFilterOption.style.pointerEvents = 'auto'
  uploadFilterOption.style.pointerEvents = 'auto'
  downloadFilterOption.style.pointerEvents = 'auto'
  startDate.disabled = false
  endDate.disabled = false
  resetDateBtn.disabled = false
  planningAreaDD.disabled = false
  datePeriodDD.disabled = false
  sortingDD.disabled = false
  resetDateBtn.style.pointerEvents = 'auto'
}

function parseAndFormatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Intl.DateTimeFormat('default', options).format(parseISO(date))
}


//Event listener -------------------------------------

//If user select All
allFilterOption.addEventListener('click', function () {
  //Clear Table Body
  tableBody.innerHTML = ""

  //Underline the "All" option filter
  setOptionActive(allFilterOption, [uploadFilterOption, downloadFilterOption])

  url = retrieveDefaultURL("allFilterOption", sortDetail.classList.value,  planningAreaSelected.innerHTML, startDate.value, endDate.value, 1)
  renderActivityData(url)
})

//If user select Upload
uploadFilterOption.addEventListener('click', function () {
  //Clear Table Body
  tableBody.innerHTML = ""

  //Underline the "Upload" option filter 
  setOptionActive(uploadFilterOption, [allFilterOption, downloadFilterOption])

  url = retrieveDefaultURL("uploadFilterOption", sortDetail.classList.value,  planningAreaSelected.innerHTML, startDate.value, endDate.value, 1)
  renderActivityData(url)
})

//If user select Download
downloadFilterOption.addEventListener('click', function () {
  //Clear Table Body
  tableBody.innerHTML = ""

  //Underline the "Download" option filter 
  setOptionActive(downloadFilterOption, [allFilterOption, uploadFilterOption])

  url = retrieveDefaultURL("downloadFilterOption", sortDetail.classList.value,  planningAreaSelected.innerHTML, startDate.value, endDate.value, 1)
  renderActivityData(url)
})

dateDSC.addEventListener('click', function () {
  //Clear table body
  tableBody.innerHTML = ""

  url = retrieveDefaultURL(document.getElementsByClassName("filter-option-active")[0].id, "dateDSC",  planningAreaSelected.innerHTML, startDate.value, endDate.value, 1)
  renderActivityData(url)
})

dateASC.addEventListener('click', function () {
  //Clear table body
  tableBody.innerHTML = ""

  url = retrieveDefaultURL(document.getElementsByClassName("filter-option-active")[0].id, "dateASC",  planningAreaSelected.innerHTML, startDate.value, endDate.value, 1)
  renderActivityData(url)
})

$(document).on("click", '.planning-area-item', "a", function (e) {
  //Clear table body
  tableBody.innerHTML = ""

  //Underline the "All" option filter
  setOptionActive(allFilterOption, [uploadFilterOption, downloadFilterOption])

  let planningAreaItem = document.getElementsByClassName('planning-area-item')
  for (let i = 0; i < planningAreaItem.length; i++) {
    planningAreaItem[i].style.backgroundColor = '#FFFFFF'
  }

  e.target.style.backgroundColor = "rgb(227, 230, 228)"

  url = retrieveDefaultURL("allFilterOption", sortDetail.classList.value, e.target.innerHTML, startDate.value, endDate.value, 1)
  renderActivityData(url)
})

startDate.addEventListener('change', function () {
  resetDateBtn.classList.add("d-none")
  document.getElementById('dateDropdownDivider').classList.add('d-none')
  if (!endDate.value) {
    dateErrMsg.innerHTML = "Please select ending date"
  }
  else if (startDate.value > endDate.value) {
    dateErrMsg.innerHTML = "Please select date before ending date"
  }
  else {
    dateErrMsg.innerHTML = ""
    resetDateBtn.classList.remove("d-none")
    document.getElementById('dateDropdownDivider').classList.remove('d-none')
    filterDate()
  }
})

endDate.addEventListener('change', function () {
  resetDateBtn.classList.add("d-none")
  document.getElementById('dateDropdownDivider').classList.add('d-none')
  if (!startDate.value) {
    dateErrMsg.innerHTML = "Please select starting date"
  }
  else if (startDate.value > endDate.value) {
    dateErrMsg.innerHTML = "Please select date after starting date"
  }
  else {
    dateErrMsg.innerHTML = ""
    resetDateBtn.classList.remove("d-none")
    document.getElementById('dateDropdownDivider').classList.remove('d-none')
    filterDate()
  }
})

resetDateBtn.addEventListener('click', function () {
  //Clear Table Body
  document.getElementById("activityTableBody").innerHTML = ""

  //Underline the "All" option filter
  setOptionActive(allFilterOption, [uploadFilterOption, downloadFilterOption])

  //Reset Date
  startDate.value = ""
  endDate.value = ""
  resetDateBtn.classList.add("d-none")
  document.getElementById('dateDropdownDivider').classList.add('d-none')

  url = retrieveDefaultURL("allFilterOption", sortDetail.classList.value,  planningAreaSelected.innerHTML, "", "", 1)
  renderActivityData(url)
})

refreshTableBtn.addEventListener('click', function () {
  //Clear Table Body
  tableBody.innerHTML = ""

  const filterOption = document.getElementsByClassName("filter-option-active")[0].id
  const page = document.getElementsByClassName("active-page-no")[0].innerHTML
  
  url = retrieveDefaultURL(filterOption, sortDetail.classList.value,  planningAreaSelected.innerHTML, startDate.value, endDate.value, page)
  renderActivityData(url)
})

$(document).on("click", '.page-link', "a", function (e) {
  //Clear Table Body
  document.getElementById("activityTableBody").innerHTML = ""
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

  url = retrieveDefaultURL(document.getElementsByClassName("filter-option-active")[0].id, sortDetail.classList.value,  planningAreaSelected.innerHTML, startDate.value, endDate.value, page)
  renderActivityData(url)
})


//Function Call --------------------------
url = retrieveDefaultURL(document.getElementsByClassName("filter-option-active")[0].id, "dateDSC", "ALL", "", "", 1)
renderActivityData(url)

planningAreaDropDown()
