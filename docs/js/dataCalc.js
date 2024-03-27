let countryCodes = [];
let alreadyGotCountryCodes = [];

function initSections(data, countries) {
	for (const [year, info] of Object.entries(data)) {
		cloneInfoSections(year, info, data, countries);
	}
}

function giveCountryAColor(
	year,
	countryWithCount,
	themeColor,
	themeColorText,
	svg,
	countries
) {
	const paths = svg.querySelectorAll(`path`);
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
	descOfSvg.textContent = `The world map shows with the theme color where all the visitors come from. The team color is currently: ${themeColorText}. The colored countries are: ${visitedCountriesString}.`;
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

function cloneInfoSections(year, info, data, countries) {
	const template = document.getElementById('template');
	const infoSection = document.querySelector('.info');

	const firstClone = template.content.cloneNode(true);
	const sections = firstClone.querySelectorAll(
		'.data-current-year > section > section'
	);
	sections.forEach((section) => {
		section.style.background = info.color.hex;
	});

	firstClone.querySelector('section').id = year;

	// Some changes of the id in the svg in the template
	const map = firstClone.querySelector('section > section svg');
	const title = firstClone.querySelector('section > section svg title');
	const desc = firstClone.querySelector('section > section svg desc');
	title.id = `title-${year}`;
	title.textContent = title.textContent.replace(/\s/g, ' ');
	desc.id = `desc-${year}`;
	desc.textContent = desc.textContent.replace(/\s/g, ' ');
	map.setAttribute('aria-labelledby', `title-${year}`);
	map.setAttribute('aria-describedby', `desc-${year}`);

	const countryWithCount = data[year].attendees.countries; // data for the year
	const themeColor = data[year].color.hex; // theme color for the year
	const themeColorTextData = info.color.name;
	const themeColorText = firstClone.querySelector('.color');
	themeColorText.textContent = themeColor;

	const titleEvent = firstClone.querySelector('.title');
	const titleText = data[year].title;
	const cssDay = 'CSS Day';
	let restOfText = titleText.substring(cssDay.length + 1); // Add 1 to exclude the space
	const plusIndex = restOfText.indexOf('+');
	let extra;
	if (plusIndex !== -1) {
		extra = restOfText.substring(plusIndex + 1); // Extract text after the "+"
		restOfText = restOfText.substring(0, plusIndex);
	}
	const hiddenText = titleEvent.querySelector('.visually-hidden');
	hiddenText.textContent = cssDay;
	const rotateYear = titleEvent.querySelector('.rotate');
	rotateYear.textContent = restOfText;
	const specialText = titleEvent.querySelector('.extra');
	specialText.textContent = extra;

	const mc = firstClone.querySelector('.mc');

	data[year].mc.forEach((singleMc) => {
		const div = document.createElement('div');
		const img = document.createElement('img');
		const name = document.createElement('a');
		if (singleMc.avatar) {
			img.src = singleMc.avatar;
		} else {
			img.src = 'images/dummy-portrait.jpg';
		}
		img.alt = '';
		name.href = singleMc.link;
		name.textContent = singleMc.name + ' | MC';

		div.appendChild(img);
		div.appendChild(name);

		mc.appendChild(div);
	});

	const videoId = getMostWatchedVideo(info);
	const iframe = firstClone.querySelector('iframe');
	iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;

	infoSection.appendChild(firstClone); // append template to section

	const dummyData = document.getElementById('dummy-data');
	if (dummyData) {
		dummyData.remove();
	}

	giveCountryAColor(
		year,
		countryWithCount,
		themeColor,
		themeColorTextData,
		map,
		countries
	); // fill in the map colors
	eventListenerButtons(data);
}

function getMostWatchedVideo(data) {
	const videos = data.talks
		.map((talk) => talk.video)
		.filter((video) => !!video)
		.sort((a, b) => b.views - a.views);

	if (videos.length === 0) return 'dPmZqsQNzGA?privacy_mode=1&start=14';
	return videos[0]['youtube-id'] + '?privacy_mode=1';
}
