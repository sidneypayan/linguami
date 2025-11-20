require('dotenv').config({ path: '.env.local' })

async function testYandexTranslation() {
	const word = 'доброй' // Test with declined form
	const langPair = 'ru-en'

	const apiUrl = new URL('https://dictionary.yandex.net/api/v1/dicservice.json/lookup')
	apiUrl.searchParams.append('key', process.env.YANDEX_DICT_API_KEY)
	apiUrl.searchParams.append('lang', langPair)
	apiUrl.searchParams.append('text', word)
	apiUrl.searchParams.append('flags', '004')

	console.log('Testing Yandex API with:')
	console.log('- Word:', word)
	console.log('- Lang pair:', langPair)
	console.log('- URL:', apiUrl.toString().replace(process.env.YANDEX_DICT_API_KEY, 'HIDDEN'))
	console.log('\n')

	try {
		const response = await fetch(apiUrl.toString())
		console.log('Response status:', response.status, response.statusText)

		const data = await response.json()
		console.log('\nResponse data:')
		console.log(JSON.stringify(data, null, 2))

		if (data.def && data.def.length > 0) {
			console.log('\n✅ Translation found!')
			console.log('Translations:', data.def[0].tr?.map(t => t.text).join(', '))
		} else {
			console.log('\n❌ No translations found')
		}
	} catch (error) {
		console.error('Error:', error.message)
	}
}

testYandexTranslation()
