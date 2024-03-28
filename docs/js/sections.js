let countryCodes = [];
let alreadyGotCountryCodes = [];

function initSections(data, countries) {
	for (const [year, info] of Object.entries(data)) {
		cloneInfoSections(year, info, data, countries);
	}
}

function cloneInfoSections(year, info, data, countries) {
	const template = document.getElementById('template');
	const infoSection = document.querySelector('.info');

	const firstClone = template.content.cloneNode(true);
	const sections = firstClone.querySelectorAll(
		'.data-current-year > section > section'
	);

	firstClone.querySelector('section').style.backgroundColor = info.color.hex;

	firstClone.querySelector('section').id = year;

	// Some changes of the id in the svg in the template
	const map = firstClone.querySelector('section > section.svg-section svg');
	const title = firstClone.querySelector('section > section svg title');
	const desc = firstClone.querySelector('section > section svg desc');
	title.id = `title-${year}`;
	title.textContent = title.textContent.replace(/(\s|\n|\t)+/g, ' ');
	desc.id = `desc-${year}`;
	desc.textContent = desc.textContent.replace(/(\s|\n|\t)+/g, ' ');
	map.setAttribute('aria-labelledby', `title-${year}`);
	map.setAttribute('aria-describedby', `desc-${year}`);

	const countryWithCount = data[year].attendees.countries; // data for the year
	const themeColor = data[year].color.hex; // theme color for the year
	const themeColorTextData = info.color.name;

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

	const div = document.createElement('div');

	data[year].mc.forEach((singleMc, index) => {
		const img = document.createElement('img');
		img.src = singleMc.avatar || 'images/dummy-portrait.jpg'; // Use singleMc.avatar if available, otherwise use a default image
		img.alt = '';

		const name = document.createElement('a');
		name.href =
			singleMc.link ||
			'https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1';
		name.target = '_blank';

		const divImg = document.createElement('div');
		name.textContent = singleMc.name + ' | MC';
		div.appendChild(name);
		divImg.appendChild(img);
		div.appendChild(divImg);
	});

	// Append the containers to the main container
	mc.appendChild(div);

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
	eventListenerButtons(data, countries);
}

function getMostWatchedVideo(data) {
	const videos = data.talks
		.map((talk) => talk.video)
		.filter((video) => !!video)
		.sort((a, b) => b.views - a.views);

	if (videos.length === 0) return 'dPmZqsQNzGA?privacy_mode=1&start=14';
	return videos[0]['youtube-id'] + '?privacy_mode=1';
}
