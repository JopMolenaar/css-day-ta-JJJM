document.addEventListener('DOMContentLoaded', async () => {
	await buildNav();
	initChart();
});

const buildNav = async () => {
	const data = await getChartData();

	const template = document.getElementById('template_timeline_item');
	const navList = document.querySelector('nav ul');

	data.labels.forEach((label) => {
		const listItem = template.content.cloneNode(true);
		const a = listItem.querySelector('a');
		const span = listItem.querySelector('span');
		a.href = `#${label}`;
		span.textContent = label;

		navList.appendChild(listItem);
	});
};
