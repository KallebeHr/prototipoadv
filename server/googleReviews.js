// Apenas servidor: este módulo nunca é importado pelos componentes Vue.
export const REVIEW_FIELDS = 'id,displayName,rating,userRatingCount,googleMapsUri,googleMapsLinks,reviews,attributions'
export const SUMMARY_FIELDS = 'id,displayName,rating,userRatingCount,googleMapsUri,googleMapsLinks,attributions'

export function httpsUrl (value) {
  try {
    const url = new URL(String(value || ''))
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''
  } catch {
    return ''
  }
}

function validRating (value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 5 ? value : null
}

export function normalizePlace (place, placeId, view = 'reviews') {
  const profileUrl = httpsUrl(place.googleMapsLinks?.placeUri || place.googleMapsUri)
  const reviewsUrl = httpsUrl(place.googleMapsLinks?.reviewsUri) || profileUrl
  return {
    status: 'ready',
    configured: true,
    provider: 'Google Maps',
    placeId,
    name: String(place.displayName?.text || ''),
    rating: validRating(place.rating),
    reviewCount: Number.isSafeInteger(place.userRatingCount) && place.userRatingCount >= 0 ? place.userRatingCount : null,
    links: { profile: profileUrl, reviews: reviewsUrl, writeReview: httpsUrl(place.googleMapsLinks?.writeAReviewUri) },
    ordering: 'relevance',
    reviews: view === 'summary'
      ? []
      : (Array.isArray(place.reviews) ? place.reviews : []).slice(0, 5).map((review, index) => ({
          id: String(review.name || `review-${index}`),
          author: {
            name: String(review.authorAttribution?.displayName || 'Usuário do Google'),
            url: httpsUrl(review.authorAttribution?.uri),
            photo: httpsUrl(review.authorAttribution?.photoUri),
          },
          rating: validRating(review.rating),
          text: String(review.text?.text || review.originalText?.text || ''),
          originalText: String(review.originalText?.text || ''),
          translated: Boolean(review.originalText?.text && review.text?.text && review.originalText.text !== review.text.text),
          relativeDate: String(review.relativePublishTimeDescription || ''),
          publishedAt: String(review.publishTime || ''),
          url: httpsUrl(review.googleMapsUri),
          reportUrl: httpsUrl(review.flagContentUri),
          visitDate: review.visitDate && Number.isInteger(review.visitDate.year) && Number.isInteger(review.visitDate.month)
            ? { year: review.visitDate.year, month: review.visitDate.month }
            : null,
        })),
    attributions: (Array.isArray(place.attributions) ? place.attributions : []).map(item => ({ name: String(item.provider || ''), url: httpsUrl(item.providerUri) })).filter(item => item.name),
  }
}

export async function fetchGoogleReviews ({ env = process.env, fetchImpl = globalThis.fetch, view = 'reviews' } = {}) {
  const apiKey = String(env.GOOGLE_PLACES_API_KEY || '').trim()
  const placeId = String(env.GOOGLE_PLACE_ID || '').trim().replace(/^places\//, '')
  if (!apiKey || !placeId) {
    return { httpStatus: 200, body: { status: 'unconfigured', configured: false, reviews: [] } }
  }
  if (!/^[\w-]+$/.test(placeId)) {
    return { httpStatus: 503, body: { status: 'unavailable', code: 'INVALID_PLACE_ID', reviews: [] } }
  }

  try {
    const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`)
    url.searchParams.set('languageCode', 'pt-BR')
    url.searchParams.set('regionCode', 'BR')
    const response = await fetchImpl(url, {
      headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': view === 'summary' ? SUMMARY_FIELDS : REVIEW_FIELDS },
      signal: AbortSignal.timeout(9000),
      cache: 'no-store',
    })
    if (!response.ok) {
      const code = ({ 429: 'GOOGLE_QUOTA_EXCEEDED', 401: 'GOOGLE_ACCESS_DENIED', 403: 'GOOGLE_ACCESS_DENIED', 404: 'GOOGLE_PLACE_NOT_FOUND' })[response.status] || 'GOOGLE_UNAVAILABLE'
      return { httpStatus: 503, body: { status: 'unavailable', code, reviews: [] } }
    }
    const place = await response.json()
    if (!place || place.id !== placeId) {
      return { httpStatus: 502, body: { status: 'unavailable', code: 'INVALID_GOOGLE_RESPONSE', reviews: [] } }
    }
    return { httpStatus: 200, body: normalizePlace(place, placeId, view) }
  } catch (error) {
    return { httpStatus: 503, body: { status: 'unavailable', code: error.name === 'TimeoutError' || error.name === 'AbortError' ? 'GOOGLE_TIMEOUT' : 'GOOGLE_UNAVAILABLE', reviews: [] } }
  }
}
