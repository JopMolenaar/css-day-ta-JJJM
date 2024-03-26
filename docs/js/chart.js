'use strict'

async function initChart() {
	try {
		const ctx = document.getElementById('timeline-chart')

		const data = await getChartData()

		new Chart(ctx, {
			type: 'line',
			data: {
				labels: data.labels,
				datasets: [
					{ label: 'Attendees', data: data.nrOfAttendees },
					{ label: 'Price', data: data.prices },
					{ label: 'Views', data: data.views, yAxisID: 'y1' },
				],
			},
			options: {
				aspectRatio: 4,
				scales: {
					x: { display: false },
					y: { display: false },
					y1: {
						type: 'linear',
						display: false,
						position: 'right',
						grid: { drawOnChartArea: false },
					},
				},
			},
		})

		setChartFallback(ctx, data)

		window.addEventListener('resize', () => {
			const root = document.documentElement
			const timeline = document.querySelector('nav.timeline_nav')
			const lastChild = timeline.querySelector('ul li:last-child')
			const ctx = document.getElementById('timeline-chart')

			const width = timeline.offsetWidth - lastChild.offsetWidth
			const height = `${Math.max(100, width / 4)}px`

			root.style.setProperty('--chart-width', `${width}px`)
			root.style.setProperty('--chart-height', `${height}px`)

			ctx.style.width = `${width}px`
			ctx.style.height = height
			ctx.parentElement.style.width = `${width}px`
			ctx.parentElement.style.height = height
		})

		const root = document.documentElement
		const timeline = document.querySelector('nav.timeline_nav')
		const lastChild = timeline.querySelector('ul li:last-child')

		const width = timeline.offsetWidth - lastChild.offsetWidth
		const height = `${Math.max(100, width / 4)}px`

		root.style.setProperty('--chart-width', `${width}px`)
		root.style.setProperty('--chart-height', `${height}px`)

		ctx.style.width = `${width}px`
		ctx.style.height = height
		ctx.parentElement.style.width = `${width}px`
		ctx.parentElement.style.height = height
	} catch (e) {
		console.error(e)
	}
}

/**
 * Gets data for the chart
 * @returns {Promise<{labels: string[]; nrOfAttendees: number[]; prices: number[]; views: number[]}>} The data
 */
async function getChartData() {
	try {
		const data = await dataPromise

		if (!data) throw new Error('No data')

		const labels = Object.keys(data)
		const nrOfAttendees = labels.map((label) => data[label].attendees.count)
		const prices = labels.map((label) => data[label].price)
		const views = labels.map((label) =>
			data[label].talks.reduce(
				(acc, talk) => acc + (talk.video?.views ?? 0),
				0
			)
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
function setChartFallback(ctx, data) {
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
