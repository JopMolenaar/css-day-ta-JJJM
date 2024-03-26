/**
 * @type {Promise<Record<string, {price: number; attendees: {count: number}; talks: {video: {views: number}}[]}> | null>} The data
 */
const data = fetchData()

/**
 * Fetches the data
 * @returns {Promise<Record<string, {price: number; attendees: {count: number}; talks: {video: {views: number}}[]}> | null>} The data
 */
async function fetchData() {
	try {
		const result = await fetch('./../data/data.json')
		return await result.json()
	} catch (e) {
		console.error(e)
		return null
	}
}
