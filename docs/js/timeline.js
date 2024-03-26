document.addEventListener('DOMContentLoaded', async () => {
	console.log('DOM loaded')
	await buildNav()
	initChart()
})

const buildNav = async () => {
	const data = await getData()
	console.log('data', data)

	const template = document.getElementById('template_timeline_item')
	const navList = document.querySelector('nav ul')

	data.labels.forEach((label) => {
		const listItem = template.content.cloneNode(true)
		const a = listItem.querySelector('a')
		a.href = `#${label}`
		a.textContent = label

		navList.appendChild(listItem)
	})
}
