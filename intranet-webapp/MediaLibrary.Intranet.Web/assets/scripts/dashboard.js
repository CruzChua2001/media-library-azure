import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
} from 'chart.js';

import { setAdminNav } from './DisplayAdminNav'

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);

//Declare Navbar Active
setAdminNav("dashboard")


//Variables
let planningAreaSelect = document.querySelector("#planningAreaFilter")
let activityFilter = document.querySelector("#activityYearFilter")
let fileSizeFilter = document.querySelector("#fileSizeYearFilter")
let viewTop = document.querySelector("#viewTop")
const uaReport = document.getElementById('UA_Report').getContext('2d');
const fsReport = document.getElementById('FS_Report').getContext('2d');
const upCompare = document.getElementById('UP_Compare').getContext('2d');
const downCompare = document.getElementById('DOWN_Compare').getContext('2d');
let uaChart;
let fsChart;


//Functions
function getRegionName(regionId) {
  switch (parseInt(regionId)) {
    case 1:
      return "North"
    case 2:
      return "East"
    case 3:
      return "West"
    case 4:
      return "Central"
    case 5:
      return "North-East"
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
        const regionId = e["RegionId"]

        if (!all_region_id.includes(regionId)) {
          all_region_id.push(regionId)
        }

        let area = {}
        area[regionId] = planningAreaName
        p_area.push(area)
      })
      let all_option = document.createElement("option")
      all_option.innerHTML = "All Planning Area"
      all_option.value = "ALL"
      planningAreaSelect.appendChild(all_option)

      for (let i = 0; i < all_region_id.length; i++) {
        let option_group = document.createElement("optgroup")
        option_group.label = getRegionName(all_region_id[i])
        for (let j = 0; j < p_area.length; j++) {
          if (Object.keys(p_area[j]) == all_region_id[i]) {
            let option = document.createElement("option")
            option.innerHTML = Object.values(p_area[j])
            option.value = Object.values(p_area[j])
            option_group.appendChild(option)
          }
        }
        planningAreaSelect.appendChild(option_group)
      }
    })
    .catch((error) => {
      console.log("Error: " + error);
    })
}

function filterYearDropDown(select) {
  let year = 2020
  let currYear = new Date().getFullYear()
  
  for (let i = year; i <= currYear; i++) {
    let option = document.createElement("option")
    option.value = i
    option.innerHTML = i
    if (i == currYear) {
      option.selected = true
    }
    select.appendChild(option)
  }
}

function convertMonth(month) {
  switch (month) {
    case 1:
      return "January"
    case 2:
      return "February"
    case 3:
      return "March"
    case 4:
      return "April"
    case 5:
      return "May"
    case 6:
      return "June"
    case 7:
      return "July"
    case 8:
      return "August"
    case 9:
      return "September"
    case 10:
      return "October"
    case 11:
      return "November"
    case 12:
      return "December"
  }
}

function getMonthArray(array1, array2) {
  let allMonth = []

  if (array1.length == 0 && array2.length == 0) {
    return allMonth
  }

  array1.forEach(e => {
    if (!allMonth.includes(e.Key)) {
      allMonth.push(e.Key)
    }
  })
  array2.forEach(e => {
    if (!allMonth.includes(e.Key)) {
      allMonth.push(e.Key)
    }
  })
  allMonth = allMonth.sort(function (a, b) {
    return a - b;
  })
  for (let i = 0; i < allMonth.length; i++) {
    allMonth[i] = convertMonth(allMonth[i])
  }

  return allMonth
}

function getCountArray(array1, array2) {
  let arr = []

  if (array1.length == 0 || array2.length == 0) {
    return arr
  }

  for (let i = 0; i < array1.length; i++) {
    let found = false
    for (let j = 0; j < array2.length; j++) {
      if (array1[i] == convertMonth(array2[j].Key)) {
        arr.push(array2[j].Count)
        found = true
        break
      }
    }
    if (!found) {
      arr.push(0)
    }
  }

  return arr
}

function updateActivityChart(graphType) {
  uaChart.destroy()
  const uploadFetchApi = graphActivityUpload(planningAreaSelect.value, activityFilter.value)
  const downloadFetchApi = graphActivityDownload(planningAreaSelect.value, activityFilter.value)
  Promise.all([uploadFetchApi, downloadFetchApi])
    .then((results) => {
      generateGraphActivity(results[0].json(), results[1].json(), graphType)
    })
}


 //Render chart
let generateCardActivity = (result, result2, result3) => {
  result.then(data => {
    document.getElementById("upload-card-result").innerHTML = data
  })
  
  result2.then(data => {
    document.getElementById("download-card-result").innerHTML = data
  })

  result3.then(data => {
    document.getElementById("filesize-card-result").innerHTML = data
  })
}

let generateFileSize = (result) => {
  result.then(data => {
    let key = []
    let count = []

    data.forEach(fileSize => {
      key.push(fileSize.Key + "mb")
      count.push(fileSize.Count)
    })

    fsChart = new Chart(fsReport, {
      type: 'doughnut',
      data: {
        labels: key,
        datasets: [{
          label: 'My First Dataset',
          data: count,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  })
}

let generateGraphActivity = (result, result2, graphType) => {
  result.then(data => {
    result2.then(data2 => {
      const dataMonth = getMonthArray(data, data2)
      const dataCountUpload = getCountArray(dataMonth, data)
      const dataCountDownload = getCountArray(dataMonth, data2)
      uaChart = new Chart(uaReport, {
        type: graphType,
        data: {
          //upload
          labels: dataMonth, //Month - Key 
          datasets: [{
            label: 'Upload',
            data: dataCountUpload, //Count
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
          }, {
            //download
            label: 'Download',
            data: dataCountDownload,
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
  })
}

let generateUploadComparison = (result, result2) => {
  result.then((data) => {
    result2.then((data2) => {
      const dataMonth = getMonthArray(data, data2)
      const dataCount = getCountArray(dataMonth, data)
      const data2Count = getCountArray(dataMonth, data2)

      const year = new Date().getFullYear().toString();

      const upCompChart = new Chart(upCompare, {
        type: 'line',
        data: {
          labels: dataMonth,
          datasets: [{
              label: year,
              data: dataCount,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
          },
            {
              label: year-1,
              data: data2Count,
              fill: false,
              borderColor: 'rgb(87, 199, 38)',
              tension: 0.1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
  })
}

let generateDownloadComparison = (result, result2) => {
  result.then((data) => {
    result2.then((data2) => {
      const dataMonth = getMonthArray(data, data2)
      const dataCount = getCountArray(dataMonth, data)
      const data2Count = getCountArray(dataMonth, data2)

      const year = new Date().getFullYear().toString();

      const downCompChart = new Chart(downCompare, {
        type: 'line',
        data: {
          labels: dataMonth,
          datasets: [{
            label: year,
            data: dataCount,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: year - 1,
            data: data2Count,
            fill: false,
            borderColor: 'rgb(87, 199, 38)',
            tension: 0.1
          }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
  })
}

let generateViewCount = (result) => {
  viewTop.innerHTML = ""
  let count = 1
  result.then(data => {
    console.log(data)
    data.forEach(e => {
      fetch(`/api/media/${e.Key}`, {
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
        .then((result) => {
          let p = document.createElement("p")
          let b = document.createElement("b")
          b.innerHTML = result.Project
          b.classList.add("text-overflow")
          p.appendChild(b)
          let span = document.createElement("span")
          span.innerHTML = e.Count
          span.classList.add("float-right")
          p.appendChild(span)
          viewTop.appendChild(p)
          let hr = document.createElement("hr")
          if (count < 5) {
            viewTop.appendChild(hr)
            count++
          }
        })
        .catch((error) => {
          console.log("Error: " + error);
        })

      
    })
  })
}


//Event Listener
document.getElementById("lineGraph").addEventListener('click', function () {
  updateActivityChart("line")
})

document.getElementById("barGraph").addEventListener('click', function () {
  updateActivityChart("bar")
})

planningAreaSelect.addEventListener('change', function () {
  renderDashboard(planningAreaSelect.value)
})

activityFilter.addEventListener("change", function () {
  updateActivityChart("bar")
})

fileSizeFilter.addEventListener("change", function () {
  fsChart.destroy()
  const fileSizeApi = chartFileSize(planningAreaSelect.value, fileSizeFilter.value)
  fileSizeApi.then(results => {
    generateFileSize(results.json())
  })
})



//Retrieve Api Fetch
function graphActivityUpload(planningArea, year) {
  return fetch(`/api/activity/graph/upload/${planningArea}/${year}`, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })
}

function graphActivityDownload(planningArea, year) {
  return fetch(`/api/activity/graph/download/${planningArea}/${year}`, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })
}

function chartFileSize(planningArea, year) {
  return fetch(`/api/filedetails/filesize/${planningArea}/${year}`, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })
}


//Render entire Dashboard
function renderDashboard(planningArea, year) {
  //Check planning area and retrieve data
  //render the data

  let cardActivityUpload = fetch(`/api/activity/card/upload/${planningArea}`, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })

  let cardActivityDownload = fetch(`/api/activity/card/download/${planningArea}`, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })

  let cardActivityFileSize = fetch(`/api/activity/card/filesize/${planningArea}`, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })

  let fileSize = chartFileSize(planningArea, year)

  let graphUpload = graphActivityUpload(planningArea, year)

  let graphDownload = graphActivityDownload(planningArea, year)

  Promise.all([cardActivityUpload, cardActivityDownload, cardActivityFileSize, fileSize, graphUpload, graphDownload])
    .then(results => {
      generateCardActivity(results[0].json(), results[1].json(), results[2].json())
      generateFileSize(results[3].json())
      generateGraphActivity(results[4].json(), results[5].json(), "bar")
      //generateCViewCount(results[4].json())
    })

  let currUploadComparison = graphActivityUpload(planningArea, year)
  let pastUploadComparison = graphActivityUpload(planningArea, year - 1)

  let currDownloadComparison = graphActivityDownload(planningArea, year)
  let pastDownloadComparison = graphActivityDownload(planningArea, year - 1)

  let viewCount = fetch(`/api/dashboardActivity/viewcount/${planningArea}`, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })

  Promise.all([currUploadComparison, pastUploadComparison, currDownloadComparison, pastDownloadComparison, viewCount])
    .then(results => {
      generateUploadComparison(results[0].json(), results[1].json())
      generateDownloadComparison(results[2].json(), results[3].json())
      generateViewCount(results[4].json())
    })
}


//function call
planningAreaDropDown()

filterYearDropDown(activityFilter)
filterYearDropDown(fileSizeFilter)

renderDashboard("ALL", new Date().getFullYear())






