'use strict'

const dataPromise = fetchData()

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
		console.debug('Fetching data...')
		// TODO use 'https://cssday.nl/data.json' instead of './../data/data.json'
		const result = await fetch('./../data/data.json')
		const data = await result.json()
		console.debug('Data fetched', data)
		return data
	} catch (e) {
		console.error(e)
		return null
	}
}
