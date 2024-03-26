let countryCodes = []
let alreadyGotCountryCodes = []

async function dataCalc() {
	const data = await dataPromise
	if (data) {
		for (const [year, info] of Object.entries(data)) {
			cloneInfoSections(year, info, data)
		}
	} else {
		console.error('Failed to fetch data.')
	}
}

async function giveCountryAColor(
	year,
	countryWithCount,
	themeColor,
	themeColorText,
	svg
) {
	const paths = svg.querySelectorAll(`path`)
	const descOfSvg = document.getElementById(`desc-${year}`)
	paths.forEach((path) => {
		path.setAttribute('style', `rgb(124, 124, 124)`)
	})
	let highestNumber = 1
	for (const [country, count] of Object.entries(countryWithCount)) {
		if (highestNumber < count) {
			highestNumber = count
		}
	}
	const visitedCountries = []
	for (const [country, count] of Object.entries(countryWithCount)) {
		// console.log(`country: ${country}, count: ${count}`);
		paths.forEach((path) => {
			if (path.dataset.country) {
				if (country === path.dataset.country) {
					const color1 = themeColor
					const color2 = '#ffffff' // White

					// Define the mix ratio
					let mixRatio
					mixRatio = 0.7 - count / highestNumber

					// Convert the colors to RGB values
					const rgbColor1 = hexToRgb(color1)
					const rgbColor2 = hexToRgb(color2)

					// Calculate the mixed color manually
					const mixedColor = mixColors(rgbColor1, rgbColor2, mixRatio)

					// Set the mixed color as the fill attribute of the path element
					path.setAttribute(
						'style',
						`fill: rgb(${mixedColor.r}, ${mixedColor.g}, ${mixedColor.b})`
					)

					if (!alreadyGotCountryCodes.includes(country)) {
						alreadyGotCountryCodes.push(country)
					}
				}

				if (!countryCodes.includes(country)) {
					countryCodes.push(country)
				}
			}
		})
		if (country !== 'UK') {
			const result = await fetch(
				`https://restcountries.com/v3.1/alpha/${country}`
			) // https://restcountries.com/#endpoints-name
			const fullNameCountry = await result.json()
			visitedCountries.push(
				`${fullNameCountry[0].name.common} with ${count} visitors`
			)
		} else {
			visitedCountries.push(`United Kingdom with ${count} visitors`)
		}
	}
	countryCodes.forEach((code) => {
		if (!alreadyGotCountryCodes.includes(code) && code !== 'SG') {
			console.error('missing:', code)
		}
	})
	const visitedCountriesString = visitedCountries.join(', ')
	descOfSvg.textContent = `The world map shows with the theme color where all the visitors come from. 
    The team color is currently: ${themeColorText}. 
    The colored countries are: ${visitedCountriesString}.`
}

function hexToRgb(hex) {
	// Remove the '#' character if present
	hex = hex.replace('#', '')

	// Parse the hex color into RGB components
	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)

	// Return an object with the RGB values
	return { r, g, b }
}

// Function to mix two RGB colors with a specified ratio
function mixColors(color1, color2, ratio) {
	// Calculate the mixed RGB components
	const mixedR = Math.round((1 - ratio) * color1.r + ratio * color2.r)
	const mixedG = Math.round((1 - ratio) * color1.g + ratio * color2.g)
	const mixedB = Math.round((1 - ratio) * color1.b + ratio * color2.b)

	// Return the mixed color as an RGB object
	return { r: mixedR, g: mixedG, b: mixedB }
}

async function cloneInfoSections(year, info, data) {
	const template = document.getElementById('template')
	const infoSection = document.querySelector('.info')

	const firstClone = template.content.cloneNode(true)
	const sections = firstClone.querySelectorAll(
		'.data-current-year > section > section'
	)
	sections.forEach((section) => {
		section.style.background = info.color.hex
	})

	firstClone.querySelector('section').id = year

	// TODO hier zoeken naar de elementen om the veranderen
	// dan data[year]. iets wat je nodig hebt uit de data als textContent of url of src

	// Some changes of the id in the svg in the template
	const map = firstClone.querySelector('section > section svg')
	const title = firstClone.querySelector('section > section svg title')
	const desc = firstClone.querySelector('section > section svg desc')
	title.id = `title-${year}`
	desc.id = `desc-${year}`
	map.setAttribute('aria-labelledby', `title-${year}`)
	map.setAttribute('aria-describedby', `desc-${year}`)

	const countryWithCount = data[year].attendees.countries // data for the year
	const themeColor = data[year].color.hex // theme color for the year
	const themeColorTextData = info.color.name
	const themeColorText = firstClone.querySelector('.color')
	themeColorText.textContent = themeColor

	const titleEvent = firstClone.querySelector('.title')
	console.log(titleEvent)
	titleEvent.textContent = data[year].title

	const mc = firstClone.querySelector('.mc')

	data[year].mc.forEach((singleMc) => {
		const div = document.createElement('div')
		const img = document.createElement('img')
		const name = document.createElement('p')

		if (singleMc.avatar) {
			img.src = singleMc.avatar
		} else {
			img.src = 'images/dummy-portrait.jpg'
		}
		img.alt = ''
		name.textContent = singleMc.name + ' | MC'

		div.appendChild(img)
		div.appendChild(name)

		mc.appendChild(div)
	})

	const videoId = await getMostWatchedVideo(year)
	const iframe = firstClone.querySelector('iframe')
	iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`
	// console.log(videoId)

	// const mcName = firstClone.querySelector('.mc-name')
	// mcName.textContent = data[year].mc[0].name + ' | MC'

	// const avatar = firstClone.querySelector('.avatar')
	// if (data[year].mc[0].avatar) {
	//     avatar.src = data[year].mc[0].avatar
	// }

	// const mc = document.querySelector('.mc')

	// // create a new div element
	// const newDiv = document.createElement("div");

	// // and give it some content
	// const newContent = document.createTextNode("Hi there and greetings!");

	// // add the text node to the newly created div
	// newDiv.appendChild(newContent);

	// // add the newly created element and its content into the DOM
	// const currentDiv = firstClone.querySelector('.mc');
	// currentDiv.parentElement.insertBefore(newDiv, currentDiv);

	infoSection.appendChild(firstClone) // append template to section

	const dummyData = document.getElementById('dummy-data')
	if (dummyData) {
		dummyData.remove()
	}

	giveCountryAColor(
		year,
		countryWithCount,
		themeColor,
		themeColorTextData,
		map
	) // fill in the map colors
	eventListenerButtons()
}

/**
 * Gets the most watched video of a given year
 * @param {string} year The year
 * @returns {string | null} The most watched video of the year
 */
async function getMostWatchedVideo(year) {
	const data = await dataPromise
	const videos = data[year].talks
		.map((talk) => talk.video)
		.filter((video) => !!video)
		.sort((a, b) => b.views - a.views)

	if (videos.length === 0) return 'dPmZqsQNzGA?privacy_mode=1&start=14'
	return videos[0]['youtube-id'] + '?privacy_mode=1'
}

dataCalc()
