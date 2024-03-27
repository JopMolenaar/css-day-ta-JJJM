'use strict';

/**
 * Initializes the chart
 */
function initChart(data) {
	try {
		const ctx = document.getElementById('timeline-chart');
		const chartData = getChartData(data);

		new Chart(ctx, {
			type: 'line',
			data: {
				labels: chartData.labels,
				datasets: [
					{ label: 'Attendees', data: chartData.nrOfAttendees },
					{ label: 'Price', data: chartData.prices },
					{ label: 'Views', data: chartData.views, yAxisID: 'y1' },
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
		});

		setChartFallback(ctx, chartData);

		window.addEventListener('resize', () => {
			const root = document.documentElement;
			const timeline = document.querySelector('nav.timeline_nav');
			const lastChild = timeline.querySelector('ul li:last-child');

			const width = timeline.offsetWidth - lastChild.offsetWidth + 12;
			const height = `${Math.max(100, width / 4)}px`;

			root.style.setProperty('--chart-width', `${width}px`);
			root.style.setProperty('--chart-height', `${height}px`);

			ctx.style.width = `${width}px`;
			ctx.style.height = height;
			ctx.parentElement.style.width = `${width}px`;
			ctx.parentElement.style.height = height;
		});

		const root = document.documentElement;
		const timeline = document.querySelector('nav.timeline_nav');
		const lastChild = timeline.querySelector('ul li:last-child');

		const width = timeline.offsetWidth - (lastChild?.offsetWidth ?? 0) + 12;
		const height = `${Math.max(100, width / 4)}px`;

		root.style.setProperty('--chart-width', `${width}px`);
		root.style.setProperty('--chart-height', `${height}px`);

		ctx.style.width = `${width}px`;
		ctx.style.height = height;
		ctx.parentElement.style.width = `${width}px`;
		ctx.parentElement.style.height = height;
	} catch (e) {
		console.error(e);
	}
}

/**
 * Gets data for the chart
 * @returns {{labels: string[]; nrOfAttendees: number[]; prices: number[]; views: number[]}} The data
 */
function getChartData(data) {
	try {
		const labels = Object.keys(data);
		const nrOfAttendees = labels.map(
			(label) => data[label].attendees.count
		);
		const prices = labels.map((label) => data[label].price);
		const views = labels.map((label) =>
			data[label].talks.reduce(
				(acc, talk) => acc + (talk.video?.views ?? 0),
				0
			)
		);

		return { labels, nrOfAttendees, prices, views };
	} catch (e) {
		console.error(e);
		const header = document.querySelector('header');
		if (!header.querySelector('h1')) {
			const h1 = document.createElement('h1');
			h1.textContent = 'Error loading data';
			header.prepend(h1);
		}
	}

	return { labels: [], nrOfAttendees: [], prices: [], views: [] };
}

/**
 * Sets the fallback for the chart
 * @param {HTMLCanvasElement} ctx Canvas element
 * @param {{labels: string[]; nrOfAttendees: number[]; prices: number[]; views: number[]}} data Data for the chart
 */
function setChartFallback(ctx, data) {
	ctx.innerHTML = '';
	data.labels.forEach((label, i) => {
		const container = document.createElement('div');
		const labelElement = document.createElement('p');
		labelElement.textContent = label;
		container.appendChild(labelElement);

		const list = document.createElement('ul');
		const attendees = document.createElement('li');
		attendees.textContent = `Attendees: ${data.nrOfAttendees[i]}`;
		list.appendChild(attendees);

		const prices = document.createElement('li');
		prices.textContent = `Price: ${data.prices[i]}`;
		list.appendChild(prices);

		const views = document.createElement('li');
		views.textContent = `Views: ${data.views[i]}`;
		list.appendChild(views);

		container.appendChild(list);
		ctx.appendChild(container);
	});
}

function getOrCreateLegendList(_chart, id) {
	const legendContainer = document.getElementById(id);
	let listContainer = legendContainer.querySelector('ul');

	if (!listContainer) {
		listContainer = document.createElement('ul');
		listContainer.style.display = 'flex';
		listContainer.style.flexDirection = 'row';
		listContainer.style.margin = 0;
		listContainer.style.padding = 0;

		legendContainer.appendChild(listContainer);
	}

	return listContainer;
}

const htmlLegendPlugin = {
	id: 'htmlLegend',
	afterUpdate(chart, _args, options) {
		const ul = getOrCreateLegendList(chart, options.containerID);

		// Remove old legend items
		while (ul.firstChild) {
			ul.firstChild.remove();
		}

		// Reuse the built-in legendItems generator
		const items = chart.options.plugins.legend.labels.generateLabels(chart);

		items.forEach((item) => {
			const li = document.createElement('li');
			li.style.alignItems = 'center';
			li.style.cursor = 'pointer';
			li.style.display = 'flex';
			li.style.flexDirection = 'row';
			li.style.marginLeft = '10px';

			li.onclick = () => {
				const { type } = chart.config;
				if (type === 'pie' || type === 'doughnut') {
					// Pie and doughnut charts only have a single dataset and visibility is per item
					chart.toggleDataVisibility(item.index);
				} else {
					chart.setDatasetVisibility(
						item.datasetIndex,
						!chart.isDatasetVisible(item.datasetIndex)
					);
				}
				chart.update();
			};

			// Color box
			const boxSpan = document.createElement('span');
			boxSpan.style.background = item.fillStyle;
			boxSpan.style.borderColor = item.strokeStyle;
			boxSpan.style.borderWidth = item.lineWidth + 'px';
			boxSpan.style.display = 'inline-block';
			boxSpan.style.flexShrink = 0;
			boxSpan.style.height = '20px';
			boxSpan.style.marginRight = '10px';
			boxSpan.style.width = '20px';

			// Text
			const textContainer = document.createElement('p');
			textContainer.style.color = item.fontColor;
			textContainer.style.margin = 0;
			textContainer.style.padding = 0;
			textContainer.style.textDecoration = item.hidden
				? 'line-through'
				: '';

			const text = document.createTextNode(item.text);
			textContainer.appendChild(text);

			li.appendChild(boxSpan);
			li.appendChild(textContainer);
			ul.appendChild(li);
		});
	},
};
