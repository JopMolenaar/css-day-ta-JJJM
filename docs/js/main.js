'use strict';

const DOMContentLoaded = new Promise((resolve) => {
	document.addEventListener('DOMContentLoaded', resolve);
});

initApp();

/**
 * Initializes the application
 */
async function initApp() {
	setErrorState(false);
	setLoadingState(true);
	const splash = new Promise((resolve) => setTimeout(resolve, 3600));

	try {
		const countries = fetchCountries();
		const data = await fetchData();
		if (!data) throw new Error('No data');

		await DOMContentLoaded;

		initTimeline(data);
		initChart(data);
		initSections(data, await countries);
		await splash;
	} catch (e) {
		setErrorState(true);
		console.error(e);
	}

	setLoadingState(false);
}

/**
 * Toggles the loading state of the page
 * @param {boolean} enable Wether to enable or disable the loading state
 */
function setLoadingState(enable = false) {
	document.body.classList.toggle('loading', enable);
}

/**
 * Toggles the error state of the page
 * @param {boolean} enable Wether to enable or disable the error state
 */
function setErrorState(enable = false) {
	document.body.classList.toggle('error', enable);
	const main = document.querySelector('main');
	if (enable) {
		const info = main.querySelector('section.info');

		if (!main.querySelector('main > p')) {
			const p = document.createElement('p');
			p.textContent = 'An error occurred while loading the data.';
			main.insertBefore(p, info);
		}

		if (!main.querySelector('main > img')) {
			const img = document.createElement('img');
			img.src = 'images/error.gif';
			img.alt = '';
			main.insertBefore(img, info);
		}

		if (!main.querySelector('main > button')) {
			const button = document.createElement('button');
			button.textContent = 'Retry';
			button.addEventListener('click', initApp);
			main.insertBefore(button, info);
			button.focus();
		}
	} else if (!enable) {
		const button = main.querySelector('button');
		if (button) button.remove();
	}
}
