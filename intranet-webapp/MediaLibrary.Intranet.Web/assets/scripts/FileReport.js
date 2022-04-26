const activityData = [
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Paya Lebar", Author: "Max", Email: "max.wongweikang@gmail.com", Date: "10/04/2022", Time: "11:35pm", FileSize: 16, ViewCount: 82 },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Kallang", Author: "Teo Kah Hou (URA)", Email: "teo_kah_hou@ura.gov.sg", Date: "22/04/2022", Time: "11:35pm", FileSize: 8, ViewCount: 128 },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Yishun", Author: "Max", Email: "max.wongweikang@gmail.com", Date: "23/04/2022", Time: "11:35pm", FileSize: 13, ViewCount: 9 },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Toa Payoh", Author: "Cruz Chua", Email: "2001cruzchua@gmail.com", Date: "24/04/2022", Time: "11:35pm", FileSize: 9, ViewCount: 134 },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Kranji", Author: "Teo Kah Hou (URA)", Email: "teo_kah_hou@ura.gov.sg", Date: "20/04/2022", Time: "11:35pm", FileSize: 17, ViewCount: 82 }]

function updateActivityData(data) {
  const table = document.getElementById("fileTableBody")

  //Create a tr and td for each activity
  data.forEach(x => {
    let row = table.insertRow(-1)
    let cell1 = row.insertCell(0)
    let cell2 = row.insertCell(1)
    let cell3 = row.insertCell(2)
    let cell4 = row.insertCell(3)
    let cell5 = row.insertCell(4)
    let cell6 = row.insertCell(5)
    let cell7 = row.insertCell(6)
    let cell8 = row.insertCell(7)

    let img = document.createElement("img")
    img.src = x.Project
    img.height = "70"
    img.width = "70"

    cell1.appendChild(img)
    cell2.innerHTML = x.Location
    cell3.innerHTML = x.Author
    cell4.innerHTML = x.Email
    cell5.innerHTML = x.Date
    cell6.innerHTML = x.Time
    cell7.innerHTML = x.FileSize
    cell8.innerHTML = x.ViewCount
  })
}

//Call updateActivity to pass data into table
updateActivityData(activityData)


//Variables ------------------------------------------------
  
let nameFilter = document.getElementById("nameFilter")
let dateFilter = document.getElementById("dateFilter")
let fileSizeFilter = document.getElementById("fileSizeFilter")
let viewFilter = document.getElementById("viewFilter")

let nameASC = document.getElementById("nameASC")
let dateASC = document.getElementById("dateASC")
let fileSizeASC = document.getElementById("fileSizeASC")
let viewASC = document.getElementById("viewASC")

let nameDSC = document.getElementById("nameDSC")
let dateDSC = document.getElementById("dateDSC")
let fileSizeDSC = document.getElementById("fileSizeDSC")
let viewDSC = document.getElementById("viewDSC")

const nameHeader = document.getElementById("nameHeader")
const dateHeader = document.getElementById("dateHeader")
const fileSizeHeader = document.getElementById("fileSizeHeader")
const viewHeader = document.getElementById("viewHeader")

const tableBody = document.getElementById("fileTableBody")

let data_to_be_sorted = [];
activityData.forEach(e => {
  data_to_be_sorted.push(e)
})


//Mini Sorting Functions -------------------------------------

//Remove other filter
function removeMultipleSort(headers) {
  headers.forEach(header => {
    header.classList.remove("filter-dsc")
    header.classList.remove("filter-asc")
  })

  
}

//Reset Icons for other filter
function resetMultipleIcon(icons) {
  icons.forEach(icon => {
    icon.filter.classList.remove("d-none")
    icon.DSC.classList.add("d-none")
    icon.ASC.classList.add("d-none")
  })
}

//All Sort
function convertDSCToDefault(DSC, filter, header) {
  DSC.classList.add("d-none")
  filter.classList.remove("d-none")
  header.classList.remove("filter-dsc")
}

function convertASCToDSC(DSC, ASC, header) {
  DSC.classList.remove("d-none")
  ASC.classList.add("d-none")
  header.classList.remove("filter-asc")
  header.classList.add("filter-dsc")
}

function convertDefaultToASC(filter, ASC, header) {
  filter.classList.add("d-none")
  ASC.classList.remove("d-none")
  header.classList.add("filter-asc")
}

function compareObjectsASC(object1, object2, key) {
  let obj1, obj2;
  if (typeof (object1[key]) == "string") {
    obj1 = object1[key].toUpperCase()
    obj2 = object2[key].toUpperCase()
  }
  else {
    obj1 = object1[key]
    obj2 = object2[key]
  }

  if (obj1 < obj2) {
    return -1
  }
  if (obj1 > obj2) {
    return 1
  }
  return 0
}

function compareObjectsDSC(object1, object2, key) {
  let obj1, obj2;
  if (typeof (object1[key]) == "string") {
    obj1 = object1[key].toUpperCase()
    obj2 = object2[key].toUpperCase()
  }
  else {
    obj1 = object1[key]
    obj2 = object2[key]
  }

  if (obj1 < obj2) {
    return 1
  }
  if (obj1 > obj2) {
    return -1
  }
  return 0
}


//Sorting --------------------------

//Sort by Name
nameHeader.addEventListener('click', function () {
  //Clear table body
  tableBody.innerHTML = ""

  let sorted_data = [];
  removeMultipleSort([dateHeader, fileSizeHeader, viewHeader])
  resetMultipleIcon([
    { filter: dateFilter, ASC: dateASC, DSC: dateDSC },
    { filter: fileSizeFilter, ASC: fileSizeASC, DSC: fileSizeDSC },
    { filter: viewFilter, ASC: viewASC, DSC: viewDSC }
  ])

  //If user is on descending data --- Convert into default data
  if (nameHeader.classList.contains("filter-dsc")) {
    sorted_data = activityData
    convertDSCToDefault(nameDSC, nameFilter, nameHeader)
  }
  //If user is on ascending data --- Convert into descending data
  else if (nameHeader.classList.contains("filter-asc")) {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsDSC(a, b, "Author")
    });
    convertASCToDSC(nameDSC, nameASC, nameHeader)
  }
  //If user is on default data --- Convert into ascending data
  else {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsASC(a, b, "Author")
    });
    convertDefaultToASC(nameFilter, nameASC, nameHeader)
  }

  updateActivityData(sorted_data)
})


//Sort by Date
dateHeader.addEventListener('click', function () {
  //Clear table body
  tableBody.innerHTML = ""

  let sorted_data = [];
  removeMultipleSort([nameHeader, fileSizeHeader, viewHeader])
  resetMultipleIcon([
    { filter: nameFilter, ASC: nameASC, DSC: nameDSC },
    { filter: fileSizeFilter, ASC: fileSizeASC, DSC: fileSizeDSC },
    { filter: viewFilter, ASC: viewASC, DSC: viewDSC }
  ])

  //If user is on descending data --- Convert into default data
  if (dateHeader.classList.contains("filter-dsc")) {
    sorted_data = activityData
    convertDSCToDefault(dateDSC, dateFilter, dateHeader)
  }
  //If user is on ascending data --- Convert into descending data
  else if (dateHeader.classList.contains("filter-asc")) {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsDSC(a, b, "Date")
    });
    convertASCToDSC(dateDSC, dateASC, dateHeader)
  }
  //If user is on default data --- Convert into ascending data
  else {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsASC(a, b, "Date")
    });
    convertDefaultToASC(dateFilter, dateASC, dateHeader)
  }

  updateActivityData(sorted_data)
})


//Sort by File Size
fileSizeHeader.addEventListener('click', function () {
  //Clear table body
  tableBody.innerHTML = ""

  let sorted_data = [];
  removeMultipleSort([dateHeader, nameHeader, viewHeader])
  resetMultipleIcon([
    { filter: nameFilter, ASC: nameASC, DSC: nameDSC },
    { filter: dateFilter, ASC: dateASC, DSC: dateDSC },
    { filter: viewFilter, ASC: viewASC, DSC: viewDSC }
  ])

  //If user is on descending data --- Convert into default data
  if (fileSizeHeader.classList.contains("filter-dsc")) {
    sorted_data = activityData
    convertDSCToDefault(fileSizeDSC, fileSizeFilter, fileSizeHeader)
  }
  //If user is on ascending data --- Convert into descending data
  else if (fileSizeHeader.classList.contains("filter-asc")) {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsDSC(a, b, "FileSize")
    });
    convertASCToDSC(fileSizeDSC, fileSizeASC, fileSizeHeader)
  }
  //If user is on default data --- Convert into ascending data
  else {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsASC(a, b, "FileSize")
    });
    convertDefaultToASC(fileSizeFilter, fileSizeASC, fileSizeHeader)
  }

  updateActivityData(sorted_data)
})


//Sort by View Count
viewHeader.addEventListener('click', function () {
  //Clear table body
  tableBody.innerHTML = ""
  
  let sorted_data = [];
  removeMultipleSort([nameHeader, fileSizeHeader, dateHeader])
  resetMultipleIcon([
    { filter: nameFilter, ASC: nameASC, DSC: nameDSC },
    { filter: fileSizeFilter, ASC: fileSizeASC, DSC: fileSizeDSC },
    { filter: dateFilter, ASC: dateASC, DSC: dateDSC }
  ])

  //If user is on descending data --- Convert into default data
  if (viewHeader.classList.contains("filter-dsc")) {
    sorted_data = activityData
    convertDSCToDefault(viewDSC, viewFilter, viewHeader)
  }
  //If user is on ascending data --- Convert into descending data
  else if (viewHeader.classList.contains("filter-asc")) {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsDSC(a, b, "ViewCount")
    });
    convertASCToDSC(viewDSC, viewASC, viewHeader)
  }
  //If user is on default data --- Convert into ascending data
  else {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsASC(a, b, "ViewCount")
    });
    convertDefaultToASC(viewFilter, viewASC, viewHeader)
  }

  updateActivityData(sorted_data)
})
