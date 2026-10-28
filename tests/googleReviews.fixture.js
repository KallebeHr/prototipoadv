// Dados fictícios exclusivamente para testes; nunca importados pela interface.
export const TEST_PLACE_ID = 'ChIJTestOnly123'
export const TEST_ENV = { GOOGLE_PLACES_API_KEY: 'private-test-key', GOOGLE_PLACE_ID: TEST_PLACE_ID }
export function placeFixture () {
  return {
    id: TEST_PLACE_ID,
    displayName: { text: 'Perfil fictício de teste' },
    rating: 4.4,
    userRatingCount: 37,
    googleMapsUri: 'https://www.google.com/maps/place/?q=place_id:ChIJTestOnly123',
    googleMapsLinks: {
      reviewsUri: 'https://www.google.com/maps/place/?q=place_id:ChIJTestOnly123',
      writeAReviewUri: 'https://search.google.com/local/writereview?placeid=ChIJTestOnly123',
    },
    reviews: Array.from({ length: 5 }, (_, index) => ({
      name: `places/ChIJTestOnly123/reviews/test-${index}`,
      rating: [5, 4, 1, 5, 3][index],
      authorAttribution: { displayName: `Autor de teste ${index + 1}`, uri: `https://www.google.com/maps/contrib/test-${index}`, photoUri: 'https://lh3.googleusercontent.com/test-review-avatar' },
      text: { text: index === 0 ? 'Este é um comentário fictício usado somente para verificar a leitura completa de uma avaliação extensa. '.repeat(6) : (index === 1 ? 'Texto traduzido usado somente no teste.' : `Comentário fictício ${index + 1}, somente para testes.`), languageCode: 'pt-BR' },
      originalText: { text: index === 1 ? 'Original text for automated testing only.' : '', languageCode: index === 1 ? 'en' : 'pt-BR' },
      relativePublishTimeDescription: 'há 2 semanas',
      publishTime: '2026-10-01T12:00:00Z',
      googleMapsUri: `https://www.google.com/maps/reviews/test-${index}`,
      flagContentUri: `https://www.google.com/maps/report/test-${index}`,
    })),
  }
}
