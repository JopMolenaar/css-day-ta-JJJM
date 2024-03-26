let countryCodes = []
let alreadyGotCountryCodes = []
const yearButtons = document.querySelectorAll('.yearButton')

function dataCalc(data) {
	for (const [year, info] of Object.entries(data)) {
		cloneInfoSections(year, info, data)
	}
}

function giveCountryAColor(year, countryWithCount, themeColor, svg) {
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

					// Define the mix ratio (e.g., 30% white)
					let mixRatio = 0
					if (path.dataset.country !== 'NL') {
						mixRatio = 0.7 - (count / highestNumber) * 2
					}

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
		visitedCountries.push(`${country} with ${count} visitors`)
	}
	countryCodes.forEach((code) => {
		if (!alreadyGotCountryCodes.includes(code) && code !== 'SG') {
			console.error('missing:', code)
		}
	})
	const visitedCountriesString = visitedCountries.join(', ')
	descOfSvg.textContent = `The world map shows with the theme color where all the visitors come from. 
    The team color is currently: purple. 
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

function cloneInfoSections(year, info, data) {
	const template = document.getElementById('template')
	const infoSection = document.querySelector('.info')

	const firstClone = template.content.cloneNode(true)
	// console.log(firstClone);
	const sections = firstClone.querySelectorAll('section > section')
	sections.forEach((section) => {
		section.style.background = info.color.hex
	})
	const map = firstClone.querySelector('section > section svg')
	const title = firstClone.querySelector('section > section svg title')
	const desc = firstClone.querySelector('section > section svg desc')
	title.id = `title-${year}`
	desc.id = `desc-${year}`
	map.setAttribute('aria-labelledby', `title-${year}`)
	map.setAttribute('aria-describedby', `desc-${year}`)

	const countryWithCount = data[year].attendees.countries // Example data for the year
	const themeColor = data[year].color.hex // Example theme color for the year

	infoSection.appendChild(firstClone)

	giveCountryAColor(year, countryWithCount, themeColor, map)
}
