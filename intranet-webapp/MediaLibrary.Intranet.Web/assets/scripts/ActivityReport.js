const activityData = [
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Paya Lebar", Author: "Max", Email: "max.wongweikang@gmail.com", Date: "10/04/2022", Time: "11:35pm", Activity: "Download" },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Kallang", Author: "Teo Kah Hou (URA)", Email: "teo_kah_hou@ura.gov.sg", Date: "22/04/2022", Time: "11:35pm", Activity: "Upload" },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Yishun", Author: "Max", Email: "max.wongweikang@gmail.com", Date: "23/04/2022", Time: "11:35pm", Activity: "Download" },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Toa Payoh", Author: "Cruz Chua", Email: "2001cruzchua@gmail.com", Date: "24/04/2022", Time: "11:35pm", Activity: "Download" },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Kranji", Author: "Teo Kah Hou (URA)", Email: "teo_kah_hou@ura.gov.sg", Date: "20/04/2022", Time: "11:35pm", Activity: "Upload" }]

function updateActivityData(data, activityOption) {
  const table = document.getElementById("activityTableBody")

  //Filtering based on "All", "Upload", "Download"
  switch (activityOption) {
    case "uploadFilterOption":
      data = data.filter(e => e.Activity === "Upload")
      break
    case "downloadFilterOption":
      data = data.filter(e => e.Activity === "Download")
      break;
    default:
      data = data
  }

 

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
    cell7.innerHTML = x.Activity
  })
}

//Call updateActivity to pass data into table
updateActivityData(activityData, "allFilterOption")


//Variables ------------------------------------------------

let nameFilter = document.getElementById("nameFilter")
let dateFilter = document.getElementById("dateFilter")

let nameASC = document.getElementById("nameASC")
let dateASC = document.getElementById("dateASC")

let nameDSC = document.getElementById("nameDSC")
let dateDSC = document.getElementById("dateDSC")

const nameHeader = document.getElementById("nameHeader")
const dateHeader = document.getElementById("dateHeader")

const allFilterOption = document.getElementById("allFilterOption")
const uploadFilterOption = document.getElementById("uploadFilterOption")
const downloadFilterOption = document.getElementById("downloadFilterOption")

const tableBody = document.getElementById("activityTableBody")

let data_to_be_sorted = [];
activityData.forEach(e => {
  data_to_be_sorted.push(e)
})


//Mini Filter Functions --------------------------------------

function setOptionActive(filterOptionActive, filterOptions) {
  filterOptionActive.classList.add("filter-option-active")
  filterOptions.forEach(filterOption => {
    filterOption.classList.remove("filter-option-active")
  })
}

function resetAllIcon() {
  if (document.getElementById("nameFilter").classList.contains("d-none")) {
    document.getElementById("nameFilter").classList.remove("d-none")
  }
  if (!document.getElementById("nameDSC").classList.contains("d-none")) {
    document.getElementById("nameDSC").classList.add("d-none")
  }
  if (!document.getElementById("nameASC").classList.contains("d-none")) {
    document.getElementById("nameASC").classList.add("d-none")
  }
  if (document.getElementById("dateFilter").classList.contains("d-none")) {
    document.getElementById("dateFilter").classList.remove("d-none")
  }
  if (!document.getElementById("dateDSC").classList.contains("d-none")) {
    document.getElementById("dateDSC").classList.add("d-none")
  }
  if (!document.getElementById("dateASC").classList.contains("d-none")) {
    document.getElementById("dateASC").classList.add("d-none")
  }
}

function resetClass() {
  if (document.getElementById("nameHeader").classList.contains("filter-asc")) {
    document.getElementById("nameHeader").classList.remove("filter-asc")
  }
  if (document.getElementById("nameHeader").classList.contains("filter-dsc")) {
    document.getElementById("nameHeader").classList.remove("filter-dsc")
  }
  if (document.getElementById("dateHeader").classList.contains("filter-asc")) {
    document.getElementById("dateHeader").classList.remove("filter-asc")
  }
  if (document.getElementById("dateHeader").classList.contains("filter-dsc")) {
    document.getElementById("dateHeader").classList.remove("filter-dsc")
  }
}


//Filter option event listener -------------------------------------

//If user select All
allFilterOption.addEventListener('click', function () {
  //Clear Table Body
  document.getElementById("activityTableBody").innerHTML = ""

  //Underline the "All" option filter
  setOptionActive(allFilterOption, [uploadFilterOption, downloadFilterOption])

  //Reset Icons for tables
  resetAllIcon()

  //Remove Additional Classes
  resetClass()

  updateActivityData(activityData, "allFilterOption")
})


//If user select Upload
uploadFilterOption.addEventListener('click', function () {
  //Clear Table Body
  document.getElementById("activityTableBody").innerHTML = ""

  //Underline the "Upload" option filter 
  setOptionActive(uploadFilterOption, [allFilterOption, downloadFilterOption])

  //Reset Icons for tables
  resetAllIcon()

  //Remove Additional Classes
  resetClass()

  updateActivityData(activityData, "uploadFilterOption")
})


//If user select Download
downloadFilterOption.addEventListener('click', function () {
  //Clear Table Body
  document.getElementById("activityTableBody").innerHTML = ""

  //Underline the "Download" option filter 
  setOptionActive(downloadFilterOption, [allFilterOption, uploadFilterOption])

  //Reset Icons for tables
  resetAllIcon()

  //Remove Additional Classes
  resetClass()

  updateActivityData(activityData, "downloadFilterOption")
})



//Mini Sorting Functions -------------------------------------

//Remove other filter
function removeSort(header) {
  header.classList.remove("filter-dsc")
  header.classList.remove("filter-asc")
}

//Reset Icons for other filter
function resetIcon(filter, ASC, DSC) {
  filter.classList.remove("d-none")
  DSC.classList.add("d-none")
  ASC.classList.add("d-none")
}

//All Sort
function compareObjectsASC(object1, object2, key) {
  const obj1 = object1[key].toUpperCase()
  const obj2 = object2[key].toUpperCase()

  if (obj1 < obj2) {
    return -1
  }
  if (obj1 > obj2) {
    return 1
  }
  return 0
}

function compareObjectsDSC(object1, object2, key) {
  const obj1 = object1[key].toUpperCase()
  const obj2 = object2[key].toUpperCase()

  if (obj1 < obj2) {
    return 1
  }
  if (obj1 > obj2) {
    return -1
  }
  return 0
}

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


//Sorting --------------------------

//Sort by Name
nameHeader.addEventListener('click', function () {
  //Clear table body
  tableBody.innerHTML = ""
  
  let sorted_data = [];
  removeSort(dateHeader)
  resetIcon(dateFilter, dateASC, dateDSC)
  let filterOption = document.querySelector('.filter-option-active').id

  //If user is on descending data --- Convert into default data
  if (nameHeader.classList.contains("filter-dsc")){
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
  updateActivityData(sorted_data, filterOption)
})



//Sort by Date
dateHeader.addEventListener('click', function () {
  //Clear table body
  tableBody.innerHTML = ""
  //Pass data into a new array 
  let sorted_data = [];

  removeSort(nameHeader)
  resetIcon(nameFilter, nameASC, nameDSC)
  let filterOption = document.querySelector('.filter-option-active').id

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
  updateActivityData(sorted_data, filterOption)
})


