import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer } from 'node:http'
import test from 'node:test'
import { createGoogleReviewsHandler } from '../api/google-reviews.js'
import { fetchGoogleReviews, normalizePlace, REVIEW_FIELDS, SUMMARY_FIELDS } from '../server/googleReviews.js'
import { placeFixture, TEST_ENV, TEST_PLACE_ID } from './googleReviews.fixture.js'

test('sem credenciais, não chama o Google nem inventa avaliações', async () => {
  let calls = 0
  const result = await fetchGoogleReviews({ env: {}, fetchImpl: async () => {
    calls++
    throw new Error('must not fetch')
  } })
  assert.equal(calls, 0)
  assert.equal(result.httpStatus, 200)
  assert.deepEqual(result.body, { status: 'unconfigured', configured: false, reviews: [] })
})

test('consulta somente o perfil fixo e os campos necessários, sem expor a chave', async () => {
  const requests = []
  const fetchImpl = async (url, options) => {
    requests.push({ url, options })
    return new Response(JSON.stringify(placeFixture()))
  }
  const result = await fetchGoogleReviews({ env: TEST_ENV, fetchImpl })
  assert.equal(requests[0].url.hostname, 'places.googleapis.com')
  assert.equal(requests[0].url.pathname, `/v1/places/${TEST_PLACE_ID}`)
  assert.equal(requests[0].url.searchParams.get('languageCode'), 'pt-BR')
  assert.equal(requests[0].options.headers['X-Goog-Api-Key'], TEST_ENV.GOOGLE_PLACES_API_KEY)
  assert.equal(requests[0].options.headers['X-Goog-FieldMask'], REVIEW_FIELDS)
  assert.equal(requests[0].options.cache, 'no-store')
  assert.equal(result.body.rating, 4.4)
  assert.equal(result.body.reviewCount, 37)
  assert.equal(result.body.reviews[2].rating, 1)
  assert.equal(JSON.stringify(result.body).includes(TEST_ENV.GOOGLE_PLACES_API_KEY), false)
  const summary = await fetchGoogleReviews({ env: TEST_ENV, fetchImpl, view: 'summary' })
  assert.equal(requests[1].options.headers['X-Goog-FieldMask'], SUMMARY_FIELDS)
  assert.equal(SUMMARY_FIELDS.split(',').includes('reviews'), false)
  assert.deepEqual(summary.body.reviews, [])
})

test('preserva atribuição e tradução, limita a cinco sem filtrar notas baixas', () => {
  const place = placeFixture()
  place.reviews.push(...place.reviews)
  const result = normalizePlace(place, TEST_PLACE_ID)
  assert.equal(result.reviews.length, 5)
  assert.equal(result.reviews[1].translated, true)
  assert.equal(result.reviews[1].originalText, place.reviews[1].originalText.text)
  assert.equal(result.reviews[0].author.url, place.reviews[0].authorAttribution.uri)
  assert.equal(result.reviews[0].url, place.reviews[0].googleMapsUri)
  assert.equal(result.reviews[2].rating, 1)
})

test('dados ausentes e URLs inseguras não viram conteúdo falso ou links executáveis', () => {
  const place = { id: TEST_PLACE_ID, reviews: [{ authorAttribution: { uri: 'javascript:alert(1)', photoUri: 'data:image/svg+xml,example' }, rating: 99 }] }
  const result = normalizePlace(place, TEST_PLACE_ID)
  assert.equal(result.rating, null)
  assert.equal(result.reviewCount, null)
  assert.equal(result.reviews[0].rating, null)
  assert.equal(result.reviews[0].author.url, '')
  assert.equal(result.reviews[0].author.photo, '')
  assert.equal(result.reviews[0].text, '')
})

test('erros do Google são tratados e não vazam detalhes privados', async () => {
  for (const [status, code] of [[403, 'GOOGLE_ACCESS_DENIED'], [429, 'GOOGLE_QUOTA_EXCEEDED'], [404, 'GOOGLE_PLACE_NOT_FOUND'], [500, 'GOOGLE_UNAVAILABLE']]) {
    const result = await fetchGoogleReviews({ env: TEST_ENV, fetchImpl: async () => new Response('private provider error', { status }) })
    assert.equal(result.httpStatus, 503)
    assert.equal(result.body.code, code)
    assert.deepEqual(result.body.reviews, [])
    assert.equal(JSON.stringify(result.body).includes('private'), false)
  }
  const timeout = await fetchGoogleReviews({ env: TEST_ENV, fetchImpl: async () => {
    throw new DOMException('private error', 'TimeoutError')
  } })
  assert.equal(timeout.body.code, 'GOOGLE_TIMEOUT')
  const wrongPlace = await fetchGoogleReviews({ env: TEST_ENV, fetchImpl: async () => new Response(JSON.stringify({ id: 'another-place' })) })
  assert.equal(wrongPlace.httpStatus, 502)
})

test('endpoint HTTP bloqueia escrita, valida a visão e entrega dados sem cache', async () => {
  const server = createServer(createGoogleReviewsHandler({ env: TEST_ENV, fetchImpl: async () => new Response(JSON.stringify(placeFixture())) }))
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const base = `http://127.0.0.1:${server.address().port}/api/google-reviews`
  try {
    const denied = await fetch(base, { method: 'POST' })
    assert.equal(denied.status, 405)
    assert.equal(denied.headers.get('Allow'), 'GET')
    const invalid = await fetch(`${base}?view=invalid`)
    assert.equal(invalid.status, 400)
    const response = await fetch(`${base}?placeId=another-place`)
    assert.equal(response.status, 200)
    assert.match(response.headers.get('cache-control'), /no-store/)
    assert.match(response.headers.get('vercel-cdn-cache-control'), /no-store/)
    const result = await response.json()
    assert.equal(result.placeId, TEST_PLACE_ID)
    assert.equal(result.reviews.length, 5)
  } finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
  }
})
