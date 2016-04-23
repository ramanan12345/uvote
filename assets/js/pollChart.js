require('es6-promise').polyfill()

var fetch = require('isomorphic-fetch')
var randomColor = require('randomcolor')
var Chart = require('chart.js')
var canvas = document.querySelector('#poll-chart')
var pollId = canvas.dataset.pollId
var ctx = canvas.getContext('2d')

var createChart = function(poll) {
  var colors = randomColor({ count: poll.options.length })
  var data = poll.options.reduce(function(dataSet, option, i) {
    dataSet.labels = dataSet.labels.concat(option.value)
    dataSet.datasets[0].data = dataSet.datasets[0].data.concat(option.rating)
    dataSet.datasets[0].backgroundColor = dataSet.datasets[0].backgroundColor.concat(colors[i])
    return dataSet
  }, { labels: [], datasets: [{ data: [], backgroundColor: [] }]})

  var chart = new Chart(ctx, {
    type: 'pie',
    data: data
  })
}

fetch('/api/poll/' + pollId)
.then(function(response) {
  return response.json()
})
.then(function(json) {
  createChart(json.poll)
})
