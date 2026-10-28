import { loadEnv } from 'vite'
import { createGoogleReviewsHandler } from '../api/google-reviews.js'

// O mesmo endpoint funciona no Vite local e nas Functions da Vercel.
export function googleReviewsPlugin () {
  function install (server) {
    const values = loadEnv(server.config.mode, server.config.envDir, '')
    const handler = createGoogleReviewsHandler({ env: {
      GOOGLE_PLACES_API_KEY: values.GOOGLE_PLACES_API_KEY,
      GOOGLE_PLACE_ID: values.GOOGLE_PLACE_ID,
    } })
    server.middlewares.use((req, res, next) => {
      if (new URL(req.url, 'http://localhost').pathname !== '/api/google-reviews') {
        return next()
      }
      void handler(req, res).catch(() => {
        if (res.writableEnded) {
          return
        }
        res.statusCode = 500
        res.end(JSON.stringify({ status: 'unavailable', code: 'INTERNAL_ERROR' }))
      })
    })
  }
  return { name: 'google-reviews-local-api', configureServer: install, configurePreviewServer: install }
}
