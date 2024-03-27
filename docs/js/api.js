'use strict';

const dataPromise = fetchData();

/**
 * Fetches the data
 * @returns {Promise<Record<string, {
 * title: string;
 * price: number;
 * color: {name: string; hex: string};
 * attendees: {count: number; countries: Record<string, number>};
 * mc: {name: string; avatar: string | false}[];
 * talks: {video: {'youtube-id': string; views: number} | false}[]
 * }> | null>} The data
 */
async function fetchData() {
	try {
		console.debug('Fetching data...');
		const result = await fetch('https://cssday.nl/data.json');
		const data = await result.json();
		console.debug('Data fetched', data);
		return data;
	} catch (e) {
		console.error(e);
		return null;
	}
}

/**
 * Fetches countries
 * @returns {Promise<{
 * name: {common: string};
 * tld: string[];
 * cca2: string;
 * cca3: string;
 * cioc: string;
 * }[]> | null>} The countries
 */
async function fetchCountries() {
	try {
		console.debug('Fetching countries...');
		const result = await fetch('https://restcountries.com/v3.1/all');
		const data = await result.json();
		console.debug('Countries fetched', data);
		return data;
	} catch (e) {
		console.error(e);
		return [];
	}
}
