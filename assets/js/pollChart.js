require('es6-promise').polyfill()

const fetch = require('isomorphic-fetch')
const randomColor = require('randomcolor')
const Chart = require('chart.js')
const canvas = document.querySelector('#poll-chart')
const pollId = canvas.dataset.pollId
const ctx = canvas.getContext('2d')

chart.defaults.global.responsive = false

const createChart = (poll) => {
  const colors = randomColor({ count: poll.options.length })
  const data = poll.options.reduce((dataSet, option, i) => {
    dataSet.labels = dataSet.labels.concat(option.value)
    dataSet.datasets[0].data = dataSet.datasets[0].data.concat(option.rating)
    dataSet.datasets[0].backgroundColor = dataSet.datasets[0].backgroundColor.concat(colors[i])
    return dataSet
  }, { labels: [], datasets: [{ data: [], backgroundColor: [] }]})

  const chart = new Chart(ctx, {
    type: 'pie',
    data: data
  })
}

fetch('/api/poll/' + pollId)
.then(response => {
  return response.json()
})
.then(json => {
  createChart(json.poll)
})
