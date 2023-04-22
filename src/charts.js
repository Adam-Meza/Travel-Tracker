// look at fit bit 
import Chart from 'chart.js/auto';

let displayYearlyProfitChart = (location, trips) => {

  let testData = [
    { profit: 10000, year: '2019'},
    { profit: 15000, year: '2020'},
    { profit: 12000, year: '2021'},
    { profit: 20000, year: '2022'},
    { profit: 25000, year: '2023'}
  ]


  new Chart(location, {
    type: 'line',
    data: {
      labels: testData.map( data => data.year),
      datasets: [{
        label: 'total Profits',
        data: testData.map( data => data.profit),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  })
}

let displayUsersChart = (location) => {

  let testData = [
    { amountOfUsers: 10, tripsTakenPerYear: '1'},
    { amountOfUsers: 15, tripsTakenPerYear: '2'},
    { amountOfUsers: 12, tripsTakenPerYear: '3'},
    { amountOfUsers: 2, tripsTakenPerYear: '4'},
    { amountOfUsers: 25, tripsTakenPerYear: '5'},
    { amountOfUsers: 6, tripsTakenPerYear: 'Over 5'},
  ]

  
  new Chart(location, {
    type: 'bar',
    data: {
      labels: testData.map( data => data.tripsTakenPerYear),
      datasets: [{
        label: 'total Profits',
        data: testData.map( data => data.amountOfUsers),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  })
}



export { displayYearlyProfitChart }
export { displayUsersChart } 