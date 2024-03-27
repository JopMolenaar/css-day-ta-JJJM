function giveCountryAColor(
	year,
	countryWithCount,
	themeColor,
	themeColorText,
	svg,
	countries,
	subject = 'visitors'
) {
	const paths = svg.querySelectorAll(`path`);
	const titleOfSvg = document.getElementById(`title-${year}`);
	titleOfSvg.textContent = `A map of the world that shows where the ${subject} come from.`;
	const descOfSvg = document.getElementById(`desc-${year}`);
	paths.forEach((path) => {
		path.setAttribute('style', `rgb(124, 124, 124)`);
	});
	let highestNumber = 1;
	for (const [country, count] of Object.entries(countryWithCount)) {
		if (highestNumber < count) {
			highestNumber = count;
		}
	}
	const visitedCountries = [];
	for (const [country, count] of Object.entries(countryWithCount)) {
		paths.forEach((path) => {
			if (path.dataset.country) {
				if (country === path.dataset.country) {
					const color1 = themeColor;
					const color2 = '#ffffff'; // White

					// Define the mix ratio
					let mixRatio;
					mixRatio = 0.7 - count / highestNumber;

					// Convert the colors to RGB values
					const rgbColor1 = hexToRgb(color1);
					const rgbColor2 = hexToRgb(color2);

					// Calculate the mixed color manually
					const mixedColor = mixColors(
						rgbColor1,
						rgbColor2,
						mixRatio
					);

					// Set the mixed color as the fill attribute of the path element
					path.setAttribute(
						'style',
						`fill: rgb(${mixedColor.r}, ${mixedColor.g}, ${mixedColor.b})`
					);

					if (!alreadyGotCountryCodes.includes(country)) {
						alreadyGotCountryCodes.push(country);
					}
				}

				if (!countryCodes.includes(country)) {
					countryCodes.push(country);
				}
			}
		});
		const fullNameCountry = findCountryName(countries, country);
		visitedCountries.push(`${fullNameCountry} with ${count} visitors`);
	}
	countryCodes.forEach((code) => {
		if (!alreadyGotCountryCodes.includes(code) && code !== 'SG') {
			console.error('missing:', code);
		}
	});
	const visitedCountriesString = visitedCountries.join(', ');
	descOfSvg.textContent = `The world map shows with the theme color where all the ${subject} come from. The team color is currently: ${themeColorText}. The colored countries are: ${visitedCountriesString}.`;
}

function eventListenerButtons(data, countries) {
	const mapSections = document.querySelectorAll('.svg-section');

	mapSections.forEach((mapSection) => {
		const map = mapSection.querySelector('svg');
		const desc = map.querySelector('desc');
		const id = desc.getAttribute('id');
		const yearFromId = id.match(/\d+/)[0];
		const buttons = mapSection.querySelectorAll('.button-wrapper button');
		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				if (!button.classList.contains('active')) {
					buttons.forEach((button) => {
						button.classList.remove('active');
					});
					button.classList.add('active');
					for (const [year, info] of Object.entries(data)) {
						if (yearFromId === year) {
							let countryWithCount;
							if (button.textContent.trim() === 'Speakers') {
								countryWithCount = getSpeakersCountries(info);
							} else {
								countryWithCount = info.attendees.countries;
							}

							const themeColor = info.color.hex; // theme color for the year
							const themeColorText = info.color.name;
							giveCountryAColor(
								year,
								countryWithCount,
								themeColor,
								themeColorText,
								map,
								countries,
								button.textContent.trim().toLowerCase()
							);
						}
					}
				}
			});
		});
	});
}

function getSpeakersCountries(info) {
	let obj = {};
	info.talks.forEach((talk) => {
		talk.speaker.forEach((speaker) => {
			if (speaker.country) {
				if (obj[speaker.country]) {
					obj[speaker.country]++;
				} else {
					obj[speaker.country] = 1;
				}
			}
		});
	});
	return obj;
}

function hexToRgb(hex) {
	// Remove the '#' character if present
	hex = hex.replace('#', '');

	// Parse the hex color into RGB components
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	// Return an object with the RGB values
	return { r, g, b };
}

// Function to mix two RGB colors with a specified ratio
function mixColors(color1, color2, ratio) {
	// Calculate the mixed RGB components
	const mixedR = Math.round((1 - ratio) * color1.r + ratio * color2.r);
	const mixedG = Math.round((1 - ratio) * color1.g + ratio * color2.g);
	const mixedB = Math.round((1 - ratio) * color1.b + ratio * color2.b);

	// Return the mixed color as an RGB object
	return { r: mixedR, g: mixedG, b: mixedB };
}

/**
 * Find the country name based on the country code
 * @param {{
 * name: {common: string};
 * tld: string[];
 * cca2: string;
 * cca3: string;
 * cioc: string;
 * }[]} countries
 * @param {string} code
 */
function findCountryName(countries, code) {
	const country = countries.find(({ cca2, cca3, cioc }) => {
		return [cca2, cca3, cioc]
			.map((m) => m?.toLowerCase() ?? '')
			.includes(code.toLowerCase().replace('uk', 'gb'));
	});

	return country ? country.name.common : code;
}
