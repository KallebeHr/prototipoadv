import { fetchGoogleReviews } from '../server/googleReviews.js'

export function createGoogleReviewsHandler (options = {}) {
  return async function googleReviewsHandler (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'private, no-store, max-age=0')
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      res.statusCode = 405
      res.end(JSON.stringify({ status: 'unavailable', code: 'METHOD_NOT_ALLOWED' }))
      return
    }
    const url = new URL(req.url, 'http://localhost')
    const view = url.searchParams.get('view') || 'reviews'
    if (!['reviews', 'summary'].includes(view)) {
      res.statusCode = 400
      res.end(JSON.stringify({ status: 'unavailable', code: 'INVALID_VIEW' }))
      return
    }
    const result = await fetchGoogleReviews({ ...options, view })
    res.statusCode = result.httpStatus
    res.end(JSON.stringify(result.body))
  }
}

export default createGoogleReviewsHandler()
