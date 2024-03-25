initChart()

async function initChart() {
  try {
    const ctx = document.getElementById('timeline-chart')

    const data = await getData()

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
            label: 'Views',
            data: data.views,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        aspectRatio: 4,
        plugins: {
          tooltip: {
            interset: true,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
          y1: {
            type: 'linear',
            display: false,
            position: 'right',
          },
        },
      },
    })

    setFallback(ctx, data)
  } catch (e) {
    console.error(e)
  }
}

/**
 * Gets data for the chart
 * @returns {Promise<{labels: string[]; nrOfAttendees: number[]; prices: number[]; views: number[]}>} The data
 */
async function getData() {
  try {
    const result = await fetch('https://cssday.nl/data.json')

    /**
     * @type {Record<string, {price: number; attendees: {count: number}; talks: {video: {views: number}}[]}>}
     */
    const data = await result.json()

    const labels = Object.keys(data)
    const nrOfAttendees = labels.map((label) => data[label].attendees.count)
    const prices = labels.map((label) => data[label].price)
    const views = labels.map((label) =>
      data[label].talks.reduce((acc, talk) => acc + (talk.video?.views ?? 0), 0)
    )

    return { labels, nrOfAttendees, prices, views }
  } catch (e) {
    console.error(e)
  }

  return { labels: [], nrOfAttendees: [], prices: [], views: [] }
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
