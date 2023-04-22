import Chart from 'chart.js/auto';

let displayYearlyProfitChart = (location, tripsData) => {

  new Chart(location, {
    type: 'line',
    data: {
      labels: tripsData.map( data => data.year),
      datasets: [{
        label: 'total Profits',
        data: tripsData.map( data => data.profit),
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

