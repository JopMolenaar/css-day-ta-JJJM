function eventListenerButtons() {
	const mapSections = document.querySelectorAll('.svg-section')

	mapSections.forEach((mapSection) => {
		const map = mapSection.querySelector('svg')
		const desc = map.querySelector('desc')
		const id = desc.getAttribute('id')
		const yearFromId = id.match(/\d+/)[0]
		const buttons = mapSection.querySelectorAll('.button-wrapper button')
		buttons.forEach((button) => {
			button.addEventListener('click', async () => {
				if (!button.classList.contains('active')) {
					buttons.forEach((button) => {
						button.classList.remove('active')
					})
					button.classList.add('active')
					const data = await dataPromise
					if (data) {
						for (const [year, info] of Object.entries(data)) {
							if (yearFromId === year) {
								let countryWithCount
								if (button.textContent === 'Speakers') {
									countryWithCount =
										getSpeakersCountries(info)
								} else {
									countryWithCount = info.attendees.countries
								}

								const themeColor = info.color.hex // theme color for the year
								giveCountryAColor(
									year,
									countryWithCount,
									themeColor,
									map
								)
							}
						}
					}
				}
			})
		})
	})
}

function getSpeakersCountries(info) {
	let obj = {}
	info.talks.forEach((talk) => {
		talk.speaker.forEach((speaker) => {
			if (speaker.country) {
				if (obj[speaker.country]) {
					obj[speaker.country]++
				} else {
					obj[speaker.country] = 1
				}
			}
		})
	})
	return obj
}
