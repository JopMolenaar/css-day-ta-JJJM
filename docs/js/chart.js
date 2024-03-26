'use strict'

/**
 * Initializes the chart
 */
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
			plugins: [htmlLegendPlugin],
			options: {
				aspectRatio: 4,
				plugins: {
					legend: { display: false },
					htmlLegend: { containerID: 'legend-container' },
				},
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
 * @param {{labels: string[]; nrOfAttendees: number[]; prices: number[]; views: number[]}} data Data for the chart
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

const getOrCreateLegendList = (chart, id) => {
	const legendContainer = document.getElementById(id)
	let listContainer = legendContainer.querySelector('ul')

	if (!listContainer) {
		listContainer = document.createElement('ul')
		listContainer.style.display = 'flex'
		listContainer.style.flexDirection = 'row'
		listContainer.style.margin = 0
		listContainer.style.padding = 0

		legendContainer.appendChild(listContainer)
	}

	return listContainer
}

const htmlLegendPlugin = {
	id: 'htmlLegend',
	afterUpdate(chart, args, options) {
		const ul = getOrCreateLegendList(chart, options.containerID)

		// Remove old legend items
		while (ul.firstChild) {
			ul.firstChild.remove()
		}

		// Reuse the built-in legendItems generator
		const items = chart.options.plugins.legend.labels.generateLabels(chart)

		items.forEach((item) => {
			const li = document.createElement('li')
			li.style.alignItems = 'center'
			li.style.cursor = 'pointer'
			li.style.display = 'flex'
			li.style.flexDirection = 'row'
			li.style.marginLeft = '10px'

			li.onclick = () => {
				const { type } = chart.config
				if (type === 'pie' || type === 'doughnut') {
					// Pie and doughnut charts only have a single dataset and visibility is per item
					chart.toggleDataVisibility(item.index)
				} else {
					chart.setDatasetVisibility(
						item.datasetIndex,
						!chart.isDatasetVisible(item.datasetIndex)
					)
				}
				chart.update()
			}

			// Color box
			const boxSpan = document.createElement('span')
			boxSpan.style.background = item.fillStyle
			boxSpan.style.borderColor = item.strokeStyle
			boxSpan.style.borderWidth = item.lineWidth + 'px'
			boxSpan.style.display = 'inline-block'
			boxSpan.style.flexShrink = 0
			boxSpan.style.height = '20px'
			boxSpan.style.marginRight = '10px'
			boxSpan.style.width = '20px'

			// Text
			const textContainer = document.createElement('p')
			textContainer.style.color = item.fontColor
			textContainer.style.margin = 0
			textContainer.style.padding = 0
			textContainer.style.textDecoration = item.hidden
				? 'line-through'
				: ''

			const text = document.createTextNode(item.text)
			textContainer.appendChild(text)

			li.appendChild(boxSpan)
			li.appendChild(textContainer)
			ul.appendChild(li)
		})
	},
}
