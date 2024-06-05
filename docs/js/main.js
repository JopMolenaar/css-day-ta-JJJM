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
		const countries = [];
		let data = await fetchData('https://cssday.nl/data.json');

		if (!data) {
			data = await fetchData('../data/data.json');
			if (!data) {
				throw new Error('No data (even from local files)');
			}
		}

		await DOMContentLoaded;

		initTimeline(data);
		initChart(data);
		initSections(data, await countries);
		initFireworks();
		initScrollAnimationSize();
		await splash;
		if (window.location.hash) {
			const year = window.location.hash.substring(1);
			const section = document.getElementById(year);
			if (section) {
				section.scrollIntoView();
			}
		}
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
	const h1 = main.querySelector('h1');
	h1.classList.toggle('visually-hidden', !enable);
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
	} else {
		const p = document.querySelector('main > p');
		const img = document.querySelector('main > img');
		const button = main.querySelector('main > button');

		if (p) p.remove();
		if (img) img.remove();
		if (button) button.remove();
	}
}
