/**
 * Initializes the timeline
 * @param {Record<string, {
 * title: string;
 * price: number;
 * color: {name: string; hex: string};
 * attendees: {count: number; countries: Record<string, number>};
 * mc: {name: string; avatar: string | false}[];
 * talks: {video: {'youtube-id': string; views: number} | false}[]
 * }>} data The data
 */
function initTimeline(data) {
	const chartData = getChartData(data);

	const template = document.getElementById('template_timeline_item');
	const navList = document.querySelector('nav ul');
	navList.innerHTML = '';

	chartData.labels.forEach((label) => {
		const listItem = template.content.cloneNode(true);
		const a = listItem.querySelector('a');
		const span = listItem.querySelector('span');
		a.href = `#${label}`;
		span.textContent = label;

		navList.appendChild(listItem);
	});
}
