initChart()

function initChart() {
  const ctx = document.getElementById('timeline-chart')

  const data = getData()

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Attendees',
          data: data.nrOfAttendees,
        },
        {
          label: 'Price',
          data: data.prices,
        },
        {
          label: 'Views (x 100)',
          data: data.views,
        },
      ],
    },
    options: {
      aspectRatio: 4,
    },
  })

  setFallback(ctx, data)
}

/**
 * Gets data for the chart
 * @returns {{labels: string[]; nrOfAttendees: number[]; prices: number[]; views: number[]}} The data
 */
function getData() {
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

  return { labels, nrOfAttendees, prices, views }
}

/**
 * Sets the fallback for the chart
 * @param {HTMLCanvasElement} ctx Canvas element
 * @param {{labels: string[]; nrOfAttendees: number[]; prices: number[]; views: number[]}} data
 */
function setFallback(ctx, data) {
  ctx.innerHTML = ''
  data.labels.forEach((label, i) => {
    const container = document.createElement('div')
    const labelElement = document.createElement('p')
    labelElement.textContent = label
    container.appendChild(labelElement)

    const list = document.createElement('ul')
    const attendees = document.createElement('li')
    attendees.textContent = `Attendees: ${data.nrOfAttendees[i]}`
    list.appendChild(attendees)

    const prices = document.createElement('li')
    prices.textContent = `Price: ${data.prices[i]}`
    list.appendChild(prices)

    const views = document.createElement('li')
    views.textContent = `Views: ${data.views[i]}`
    list.appendChild(views)

    container.appendChild(list)
    ctx.appendChild(container)
  })
}
