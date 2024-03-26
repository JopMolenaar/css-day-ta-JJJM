'use strict'

const dataPromise = fetchData()

/**
 * Fetches the data
 * @returns {Promise<Record<string, {price: number; attendees: {count: number}; talks: {video: {views: number}}[]}> | null>} The data
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
	}
	return null
}
