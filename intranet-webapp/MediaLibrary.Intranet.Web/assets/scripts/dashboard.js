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

//const uaReport = document.getElementById('UA_Report').getContext('2d');
const fsReport = document.getElementById('FS_Report').getContext('2d');
//const ctx3 = document.getElementById('myChart3').getContext('2d');
//const ctx4 = document.getElementById('myChart4').getContext('2d');

//Declare Chart
//let uaChart = new Chart(uaReport, {
//  type: 'bar',
//  data: {
//    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//    datasets: [{
//      label: '# of Votes',
//      data: [12, 19, 3, 5, 2, 3],
//      backgroundColor: [
//        'rgba(255, 99, 132, 0.2)',
//        'rgba(54, 162, 235, 0.2)',
//        'rgba(255, 206, 86, 0.2)',
//        'rgba(75, 192, 192, 0.2)',
//        'rgba(153, 102, 255, 0.2)',
//        'rgba(255, 159, 64, 0.2)'
//      ],
//      borderColor: [
//        'rgba(255, 99, 132, 1)',
//        'rgba(54, 162, 235, 1)',
//        'rgba(255, 206, 86, 1)',
//        'rgba(75, 192, 192, 1)',
//        'rgba(153, 102, 255, 1)',
//        'rgba(255, 159, 64, 1)'
//      ],
//      borderWidth: 1
//    }, {
//      label: '# of Votes 2',
//      data: [5, 12, 2, 6, 4, 4],
//      backgroundColor: [
//        'rgba(255, 99, 132, 0.2)',
//        'rgba(54, 162, 235, 0.2)',
//        'rgba(255, 206, 86, 0.2)',
//        'rgba(75, 192, 192, 0.2)',
//        'rgba(153, 102, 255, 0.2)',
//        'rgba(255, 159, 64, 0.2)'
//      ],
//      borderColor: [
//        'rgba(255, 99, 132, 1)',
//        'rgba(54, 162, 235, 1)',
//        'rgba(255, 206, 86, 1)',
//        'rgba(75, 192, 192, 1)',
//        'rgba(153, 102, 255, 1)',
//        'rgba(255, 159, 64, 1)'
//      ],
//      borderWidth: 1
//      }
//    ]
//  },
//  options: {
//    scales: {
//      y: {
//        beginAtZero: true
//      }
//    }
//  }
//});



//const myChart3 = new Chart(ctx3, {
//  type: 'line',
//  data: {
//    labels: [ "January", "February", "March", "April", "May", "June", "July"],
//    datasets: [{
//        label: 'My First Dataset',
//        data: [65, 59, 80, 81, 56, 55, 40],
//        fill: false,
//        borderColor: 'rgb(75, 192, 192)',
//        tension: 0.1
//    },
//      {
//        label: 'My Second Dataset',
//        data: [73, 20, 48, 38, 63, 28, 52],
//        fill: false,
//        borderColor: 'rgb(87, 199, 38)',
//        tension: 0.1
//      }
//    ]
//  },
//  options: {
//    scales: {
//      y: {
//        beginAtZero: true
//      }
//    }
//  }
//});

//const myChart4 = new Chart(ctx4, {
//  type: 'line',
//  data: {
//    labels: ["January", "February", "March", "April", "May", "June", "July"],
//    datasets: [{
//      label: 'My First Dataset',
//      data: [65, 59, 80, 81, 56, 55, 40],
//      fill: false,
//      borderColor: 'rgb(75, 192, 192)',
//      tension: 0.1
//    },
//      {
//        label: 'No data available',
//        data: [],
//        fill: false,
//        borderColor: 'rgb(255, 255, 255)',
//        tension: 0.1
//      }
//    ]
//  },
//  options: {
//    scales: {
//      y: {
//        beginAtZero: true
//      }
//    }
//  }
//});



//Build Function
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

function renderDashboard(planningArea) {
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

  let fileSize = fetch(`/api/filedetails/filesize/${planningArea}/${2022}`, {
    mode: 'same-origin',
    credentials: 'same-origin',
  })

  //let graphActivityUpload = fetch('/api/activity/graph/upload', {
  //  mode: 'same-origin',
  //  credentials: 'same-origin',
  //})

  //let graphActivityDownload = fetch('/api/activity/graph/Download', {
  //  mode: 'same-origin',
  //  credentials: 'same-origin',
  //})

  //let viewCount = fetch('/api/filedetails/viewcount', {
  //  mode: 'same-origin',
  //  credentials: 'same-origin',
  //})

  Promise.all([cardActivityUpload, cardActivityDownload, cardActivityFileSize, fileSize/*, graphActivityUpload, graphActivityDownload, viewCount*/])
    .then(results => {
      generateCardActivity(results[0].json(), results[1].json(), results[2].json())
      generateFileSize(results[3].json())
      //generateGraphActivityUpload(results[1].json())
      //generateGraphActivityDownload(results[2].json())
      //generateCViewCount(results[4].json())
    })

  //render the chart
}

function buildGraph1(graphType) {
  uaChart = new Chart(uaReport, {
    type: graphType,
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

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

    const fsChart = new Chart(fsReport, {
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

//Switch Graph Types

document.getElementById("lineGraph").addEventListener('click', function () {
  uaChart.destroy()
  buildGraph1("line")
  $("#myChart").load(location.href + " #myChart")
})

document.getElementById("barGraph").addEventListener('click', function () {
  uaChart.destroy()
  buildGraph1("bar")
  $("#myChart").load(location.href + " #myChart")
})


//function call
planningAreaDropDown()

renderDashboard("ALL")

planningAreaSelect.addEventListener('change', function () {
  renderDashboard(planningAreaSelect.value)
})





