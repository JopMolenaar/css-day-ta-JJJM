const ctx = document.getElementById('timeline-chart')

const yearStart = 2013
const nrOfYears = 10

const labels = Array.from({ length: nrOfYears }, (_, i) => `${yearStart + i}`)
const nrOfAttendees = Array.from({ length: nrOfYears }, () =>
  Math.floor(Math.random() * 434)
)

const prices = Array.from({ length: nrOfYears }, () =>
  Math.floor(Math.random() * 675)
)

const views = Array.from({ length: nrOfYears }, () =>
  Math.floor(Math.random() * 200)
)

new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: 'Attendees',
        data: nrOfAttendees,
      },
      {
        label: 'Price',
        data: prices,
      },
      {
        label: 'Views (x 100)',
        data: views,
      },
    ],
  },
  options: {
    aspectRatio: 4,
    plugins: {
      //legend: false,
    },
  },
})
