const activityData = [
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Paya Lebar", Author: "Max", Email: "max.wongweikang@gmail.com", Date: "10/04/2022", Time: "11:35pm", Activity: "Download" },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Kallang", Author: "Teo Kah Hou (URA)", Email: "teo_kah_hou@ura.gov.sg", Date: "22/04/2022", Time: "11:35pm", Activity: "Upload" },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Yishun", Author: "Max", Email: "max.wongweikang@gmail.com", Date: "23/04/2022", Time: "11:35pm", Activity: "Download" },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Toa Payoh", Author: "Cruz Chua", Email: "2001cruzchua@gmail.com", Date: "24/04/2022", Time: "11:35pm", Activity: "Download" },
  { Project: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhc8Obf2wgndcUECoWmL-sTYSGxSZeHZsXXw&usqp=CAU", Location: "Kranji", Author: "Teo Kah Hou (URA)", Email: "teo_kah_hou@ura.gov.sg", Date: "20/04/2022", Time: "11:35pm", Activity: "Upload" }]

function updateActivityData(data, activityOption) {
  const table = document.getElementById("activityTableBody")

  //Filtering based on "All", "Upload", "Download"
  if (activityOption == "Upload") {
    data = data.filter(e => e.Activity === "Upload")
  } else if (activityOption == "Download") {
    data = data.filter(e => e.Activity === "Download")
  }

  //Create a tr and td for each activity
  data.forEach(x => {
    let row = table.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);

    let img = document.createElement("img");
    img.src = x.Project
    img.height = "70";
    img.width = "70";


    cell1.appendChild(img)
    cell2.innerHTML = x.Location;
    cell3.innerHTML = x.Author;
    cell4.innerHTML = x.Email;
    cell5.innerHTML = x.Date;
    cell6.innerHTML = x.Time;
    cell7.innerHTML = x.Activity;
  })
}

//Call updateActivity to pass data into table
updateActivityData(activityData, "All")


const allFilterOption = document.getElementById("allFilterOption")
const uploadFilterOption = document.getElementById("uploadFilterOption")
const downloadFilterOption = document.getElementById("downloadFilterOption")

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

//If user select All
allFilterOption.addEventListener('click', function () {
  //Clear Table Body
  document.getElementById("activityTableBody").innerHTML = ""

  //Underline the "All" option filter 
  uploadFilterOption.classList.remove("filter-option-active")
  downloadFilterOption.classList.remove("filter-option-active")
  allFilterOption.classList.add("filter-option-active")

  //Reset Icons for tables
  resetAllIcon()

  //Remove Additional Classes
  resetClass()

  updateActivityData(activityData, "All")
})


//If user select Upload
uploadFilterOption.addEventListener('click', function () {
  //Clear Table Body
  document.getElementById("activityTableBody").innerHTML = ""

  //Underline the "Upload" option filter 
  uploadFilterOption.classList.add("filter-option-active")
  downloadFilterOption.classList.remove("filter-option-active")
  allFilterOption.classList.remove("filter-option-active")

  //Reset Icons for tables
  resetAllIcon()

  //Remove Additional Classes
  resetClass()

  updateActivityData(activityData, "Upload")
})


//If user select Download
downloadFilterOption.addEventListener('click', function () {
  //Clear Table Body
  document.getElementById("activityTableBody").innerHTML = ""

  //Underline the "Download" option filter 
  uploadFilterOption.classList.remove("filter-option-active")
  downloadFilterOption.classList.add("filter-option-active")
  allFilterOption.classList.remove("filter-option-active")

  //Reset Icons for tables
  resetAllIcon()

  //Remove Additional Classes
  resetClass()

  updateActivityData(activityData, "Download")
})



//Mini Functions -------------------------------------

//Sort the array in ascending order
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

//Sort the array in descending order
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

function removeFilter(header) {
  if (header.classList.contains("filter-dsc")) {
    header.classList.remove("filter-dsc")
  }
  if (header.classList.contains("filter-asc")) {
    header.classList.remove("filter-asc")
  }
}

function resetIcon(filter, ASC, DSC) {
  if (filter.classList.contains("d-none")) {
    filter.classList.remove("d-none")
  }
  if (!DSC.classList.contains("d-none")) {
    DSC.classList.add("d-none")
  }
  if (!ASC.classList.contains("d-none")) {
    ASC.classList.add("d-none")
  }
}

function checkFilterOption(current) {
  if (current == "uploadFilterOption") {
    return "Upload"
  }
  else if (current == "downloadFilterOption") {
    return "Download"
  }
  return "All"
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

let nameFilter = document.getElementById("nameFilter")
let dateFilter = document.getElementById("dateFilter")
let nameDSC = document.getElementById("nameDSC")
let dateDSC = document.getElementById("dateDSC")
let nameASC = document.getElementById("nameASC")
let dateASC = document.getElementById("dateASC")

const nameHeader = document.getElementById("nameHeader")
const dateHeader = document.getElementById("dateHeader")


//Sorting --------------------------

//Sort by Name
nameHeader.addEventListener('click', function () {
  //Remove other filter
  removeFilter(dateHeader)

  //Reset Icons for other filter
  resetIcon(dateFilter, dateASC, dateDSC)

  //Check which filter option user is on
  const currFilterOption = document.querySelector('.filter-option-active').id
  let filterOption = checkFilterOption(currFilterOption);

  //Clear table body
  document.getElementById("activityTableBody").innerHTML = ""

  //Pass data into a new array
  let sorted_data = [];
  let data_to_be_sorted = [];
  activityData.forEach(e => {
    data_to_be_sorted.push(e)
  })

  //If user is on descending data
  //Convert into default data
  if (nameHeader.classList.contains("filter-dsc")){
    sorted_data = activityData
    convertDSCToDefault(nameDSC, nameFilter, nameHeader)
  }
  //If user is on ascending data
  //Convert into descending data
  else if (nameHeader.classList.contains("filter-asc")) {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsDSC(a, b, "Author")
    });
    convertASCToDSC(nameDSC, nameASC, nameHeader)
  }
    //If user is on default data
    //Convert into ascending data
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
  //Remove other filter
  removeFilter(nameHeader)

  //Reset Icons for other filter
  resetIcon(nameFilter, nameASC, nameDSC)

  //Check which filter option user is on
  const currFilterOption = document.querySelector('.filter-option-active').id
  let filterOption = checkFilterOption(currFilterOption);
  
  //Clear table body
  document.getElementById("activityTableBody").innerHTML = ""

  //Pass data into a new array 
  let sorted_data = [];
  let data_to_be_sorted = [];
  activityData.forEach(e => {
    data_to_be_sorted.push(e)
  })

  //If user is on descending data
  //Convert into default data
  if (dateHeader.classList.contains("filter-dsc")) {
    sorted_data = activityData
    convertDSCToDefault(dateDSC, dateFilter, dateHeader)
  }
  //If user is on ascending data
  //Convert into descending data
  else if (dateHeader.classList.contains("filter-asc")) {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsDSC(a, b, "Date")
    });
    convertASCToDSC(dateDSC, dateASC, dateHeader)
  }
  //If user is on default data
  //Convert into ascending data
  else {
    sorted_data = data_to_be_sorted.sort((a, b) => {
      return compareObjectsASC(a, b, "Date")
    });
    convertDefaultToASC(dateFilter, dateASC, dateHeader)
  }
  updateActivityData(sorted_data, filterOption)
})


