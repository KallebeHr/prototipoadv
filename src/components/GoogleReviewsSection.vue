<script setup>
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { siteConfig as c } from '../config/siteConfig'
  import ReviewStars from './ReviewStars.vue'

  const props = defineProps({ compact: { type: Boolean, default: false } })
  const section = ref(null)
  const track = ref(null)
  const data = ref(null)
  const state = ref('idle')
  const expanded = ref(new Set())
  const original = ref(new Set())
  const failedPhotos = ref(new Set())
  const active = ref(0)
  const atStart = ref(true)
  const atEnd = ref(false)
  const visible = ref(false)
  const settings = computed(() => c.googleReviews)
  const enabled = computed(() => settings.value?.enabled && (!props.compact || settings.value.showOnLinkBio))
  const reviews = computed(() => data.value?.reviews || [])
  const headingId = computed(() => props.compact ? 'bio-google-reviews-title' : 'google-reviews-title')
  const hasRating = computed(() => typeof data.value?.rating === 'number' && data.value.rating >= 1 && data.value.rating <= 5)
  const formattedRating = computed(() => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(data.value.rating))
  const countLabel = computed(() => data.value?.reviewCount == null ? '' : `${new Intl.NumberFormat('pt-BR').format(data.value.reviewCount)} ${data.value.reviewCount === 1 ? 'avaliação' : 'avaliações'}`)
  let observer
  let resizeObserver
  let controller
  let requestTimer

  function safeLink (value) {
    try {
      const url = new URL(String(value || ''))
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''
    } catch {
      return ''
    }
  }
  const readLink = computed(() => safeLink(data.value?.links?.reviews || data.value?.links?.profile || settings.value?.profileUrl))
  const writeLink = computed(() => safeLink(data.value?.links?.writeReview || settings.value?.writeReviewUrl))

  async function loadReviews () {
    if (!enabled.value || state.value === 'loading') return
    controller?.abort()
    const request = new AbortController()
    controller = request
    state.value = 'loading'
    data.value = null
    expanded.value = new Set()
    original.value = new Set()
    clearTimeout(requestTimer)
    requestTimer = setTimeout(() => request.abort(), 12_000)
    try {
      const url = new URL(settings.value.endpoint || '/api/google-reviews', window.location.origin)
      url.searchParams.set('view', props.compact ? 'summary' : 'reviews')
      const response = await fetch(url, { signal: request.signal, cache: 'no-store' })
      if (!response.ok) throw new Error('unavailable')
      const result = await response.json()
      if (controller !== request) return
      if (result.status === 'unconfigured') state.value = 'unconfigured'
      else if (result.status === 'ready' && result.configured === true && Array.isArray(result.reviews)) {
        data.value = result
        state.value = 'ready'
      } else state.value = 'unavailable'
    } catch {
      if (controller === request) state.value = 'unavailable'
    } finally {
      if (controller === request) clearTimeout(requestTimer)
    }
  }

  function toggle (collection, id) {
    const next = new Set(collection)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  }
  function toggleExpanded (id) {
    expanded.value = toggle(expanded.value, id)
  }
  function toggleOriginal (id) {
    original.value = toggle(original.value, id)
  }
  function initials (name) {
    return String(name || '').trim().split(/\s+/).slice(0, 2).map(word => word[0] || '').join('')
  }
  function reviewText (review) {
    return original.value.has(review.id) ? review.originalText : review.text
  }
  function displayedText (review) {
    const text = reviewText(review)
    return text.length > 240 && !expanded.value.has(review.id) ? `${text.slice(0, 240).trimEnd()}…` : text
  }
  function markPhotoFailed (id) {
    failedPhotos.value = new Set([...failedPhotos.value, id])
  }
  function visitLabel (visit) {
    return `${String(visit.month).padStart(2, '0')}/${visit.year}`
  }

  function measureTrack () {
    const element = track.value
    if (!element) return
    const step = (element.firstElementChild?.getBoundingClientRect().width || element.clientWidth) + 18
    active.value = Math.max(0, Math.min(reviews.value.length - 1, Math.round(element.scrollLeft / step)))
    atStart.value = element.scrollLeft <= 2
    atEnd.value = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2
  }
  function moveTrack (direction) {
    const element = track.value
    if (!element) return
    const step = (element.firstElementChild?.getBoundingClientRect().width || element.clientWidth) + 18
    element.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  watch(() => [enabled.value, settings.value?.endpoint], async () => {
    controller?.abort()
    controller = null
    clearTimeout(requestTimer)
    data.value = null
    state.value = 'idle'
    await nextTick()
    observeSection()
  })
  watch(reviews, async () => {
    resizeObserver?.disconnect()
    await nextTick()
    measureTrack()
    if (track.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measureTrack)
      resizeObserver.observe(track.value)
    }
  })
  function observeSection () {
    observer?.disconnect()
    if (!section.value || !enabled.value) return
    if (visible.value) {
      void loadReviews()
      return
    }
    if (typeof IntersectionObserver === 'undefined') {
      visible.value = true
      void loadReviews()
      return
    }
    observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      visible.value = true
      observer.disconnect()
      void loadReviews()
    }, { rootMargin: '120px' })
    observer.observe(section.value)
  }
  onMounted(observeSection)
  onUnmounted(() => {
    observer?.disconnect()
    resizeObserver?.disconnect()
    controller?.abort()
    controller = null
    clearTimeout(requestTimer)
  })
</script>

<template>
  <section
    v-if="enabled"
    :id="compact ? undefined : 'avaliacoes'"
    ref="section"
    :aria-busy="state === 'loading'"
    :aria-labelledby="headingId"
    class="google-reviews"
    :class="compact ? 'google-reviews--compact' : 'content-section'"
  >
    <div class="gr-heading">
      <div>
        <p v-if="!compact" class="eyebrow">EXPERIÊNCIAS COMPARTILHADAS</p>
        <h2 :id="headingId">{{ settings.title }}</h2>
        <p v-if="!compact" class="gr-intro">{{ settings.description }}</p>
      </div>
      <span v-if="state === 'ready'" class="gr-source" translate="no">Google Maps</span>
      <i v-else aria-hidden="true" class="mdi mdi-comment-quote-outline gr-heading-icon" />
    </div>

    <div v-if="state === 'idle' || state === 'loading'" class="gr-loading">
      <p role="status">Carregando avaliações…</p>
      <div aria-hidden="true" class="gr-skeletons"><div class="gr-skeleton" /><div v-if="!compact" class="gr-skeleton" /></div>
    </div>

    <template v-else-if="state === 'ready'">
      <div class="gr-panel">
        <div class="gr-overview">
          <p class="gr-office">{{ data.name || c.brand.shortName }}</p>
          <div v-if="hasRating" class="gr-rating">
            <strong>{{ formattedRating }}</strong>
            <div><ReviewStars :rating="data.rating" /><p v-if="countLabel">{{ countLabel }} no Google</p></div>
          </div>
          <p v-else class="gr-no-rating">{{ countLabel || 'Conheça as opiniões sobre nosso atendimento.' }}</p>
          <p v-if="!compact" class="gr-overview-note">Opiniões publicadas no Google Maps por quem compartilhou sua experiência.</p>
          <div class="gr-actions">
            <a
              v-if="writeLink"
              class="gr-button gr-button--primary"
              :href="writeLink"
              rel="noopener noreferrer"
              target="_blank"
            >Avaliar no Google<i aria-hidden="true" class="mdi mdi-arrow-top-right" /><span class="sr-only"> (abre em nova aba)</span></a>
            <a
              v-if="readLink"
              class="gr-button"
              :href="readLink"
              rel="noopener noreferrer"
              target="_blank"
            >Ver no Google<i aria-hidden="true" class="mdi mdi-arrow-top-right" /><span class="sr-only"> (abre em nova aba)</span></a>
            <a v-if="compact" class="gr-site-link" href="#avaliacoes">Ver avaliações no site<i aria-hidden="true" class="mdi mdi-arrow-right" /></a>
          </div>
        </div>

        <div v-if="!compact" class="gr-reviews-area">
          <template v-if="reviews.length > 0">
            <div
              ref="track"
              aria-label="Avaliações do escritório: use as setas ou deslize para navegar"
              class="gr-track"
              :class="{ 'gr-track--single': reviews.length === 1 }"
              role="region"
              tabindex="0"
              @keydown.left.prevent="moveTrack(-1)"
              @keydown.right.prevent="moveTrack(1)"
              @scroll.passive="measureTrack"
            >
              <article v-for="review in reviews" :key="review.id" class="gr-card">
                <header class="gr-author">
                  <div class="gr-avatar"><img
                    v-if="safeLink(review.author.photo) && !failedPhotos.has(review.id)"
                    alt=""
                    height="44"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    :src="safeLink(review.author.photo)"
                    width="44"
                    @error="markPhotoFailed(review.id)"
                  ><span v-else aria-hidden="true">{{ initials(review.author.name) }}</span></div>
                  <div><h3><a v-if="safeLink(review.author.url)" :href="safeLink(review.author.url)" rel="noopener noreferrer" target="_blank">{{ review.author.name }}<span class="sr-only"> — perfil no Google (nova aba)</span></a><template v-else>{{ review.author.name }}</template></h3><p>{{ review.relativeDate }}</p></div>
                  <i aria-hidden="true" class="mdi mdi-format-quote-close" />
                </header>
                <ReviewStars v-if="review.rating" :rating="review.rating" />
                <p v-if="review.visitDate" class="gr-visit">Visita em {{ visitLabel(review.visitDate) }}</p>
                <div class="gr-review-body">
                  <p v-if="reviewText(review)" class="gr-review-text">{{ displayedText(review) }}</p>
                  <p v-else class="gr-textless">Este autor publicou uma nota, sem comentário.</p>
                  <button
                    v-if="reviewText(review).length > 240"
                    :aria-expanded="expanded.has(review.id)"
                    :aria-label="`${expanded.has(review.id) ? 'Recolher' : 'Ler completa'}: avaliação de ${review.author.name}`"
                    class="gr-more"
                    type="button"
                    @click="toggleExpanded(review.id)"
                  >{{ expanded.has(review.id) ? 'Mostrar menos' : 'Ler avaliação completa' }}</button>
                  <div v-if="review.translated" class="gr-translation"><span>{{ original.has(review.id) ? 'Texto original' : 'Traduzido pelo Google' }}</span><button type="button" @click="toggleOriginal(review.id)">{{ original.has(review.id) ? 'Ver tradução' : 'Ver original' }}</button></div>
                </div>
                <div class="gr-card-links"><a v-if="safeLink(review.url)" :href="safeLink(review.url)" rel="noopener noreferrer" target="_blank">Ver avaliação no Google<i aria-hidden="true" class="mdi mdi-arrow-top-right" /><span class="sr-only"> (nova aba)</span></a><a
                  v-if="safeLink(review.reportUrl)"
                  :aria-label="`Reportar avaliação de ${review.author.name} ao Google (nova aba)`"
                  :href="safeLink(review.reportUrl)"
                  rel="noopener noreferrer"
                  target="_blank"
                ><i aria-hidden="true" class="mdi mdi-flag-outline" /></a></div>
              </article>
            </div>
            <div class="gr-navigation"><p aria-live="polite">{{ active + 1 }} de {{ reviews.length }}<span> · deslize para ver mais</span></p><div><button aria-label="Avaliação anterior" :disabled="atStart" type="button" @click="moveTrack(-1)"><i aria-hidden="true" class="mdi mdi-arrow-left" /></button><button aria-label="Próxima avaliação" :disabled="atEnd" type="button" @click="moveTrack(1)"><i aria-hidden="true" class="mdi mdi-arrow-right" /></button></div></div>
          </template>
          <div v-else class="gr-empty"><i aria-hidden="true" class="mdi mdi-comment-text-outline" /><h3>A sua experiência importa</h3><p>Ainda não há comentários disponíveis para exibir aqui. {{ writeLink ? 'Compartilhe sua opinião pelo botão “Avaliar no Google”.' : 'Consulte o perfil do escritório no Google para mais informações.' }}</p></div>
        </div>
      </div>
      <div v-if="!compact || data.attributions?.length" class="gr-attribution"><span v-if="!compact" translate="no">Google Maps</span><p v-if="!compact">Até cinco avaliações, selecionadas e ordenadas por relevância pelo Google.</p><a
        v-for="(item, index) in data.attributions || []"
        :key="index"
        :href="safeLink(item.url) || undefined"
        rel="noopener noreferrer"
        target="_blank"
      >{{ item.name }}</a></div>
    </template>

    <div v-else class="gr-fallback" :class="{ 'gr-fallback--error': state === 'unavailable' }">
      <i aria-hidden="true" class="mdi" :class="state === 'unavailable' ? 'mdi-cloud-alert-outline' : 'mdi-comment-heart-outline'" />
      <div><h3>{{ state === 'unavailable' ? 'As avaliações estão indisponíveis no momento.' : 'Sua experiência faz a diferença.' }}</h3><p>{{ readLink ? 'Consulte as avaliações diretamente no perfil do escritório no Google Maps.' : 'As avaliações estarão disponíveis neste espaço assim que o perfil do escritório for conectado.' }}</p></div>
      <div class="gr-actions"><a
        v-if="readLink"
        class="gr-button"
        :href="readLink"
        rel="noopener noreferrer"
        target="_blank"
      >Ver no Google<i aria-hidden="true" class="mdi mdi-arrow-top-right" /></a><a
        v-if="writeLink"
        class="gr-button gr-button--primary"
        :href="writeLink"
        rel="noopener noreferrer"
        target="_blank"
      >Avaliar no Google<i aria-hidden="true" class="mdi mdi-arrow-top-right" /></a><button v-if="state === 'unavailable'" class="gr-button" type="button" @click="loadReviews">Tentar novamente<i aria-hidden="true" class="mdi mdi-refresh" /></button><a v-if="compact" class="gr-site-link" href="#avaliacoes">Avaliações no site<i aria-hidden="true" class="mdi mdi-arrow-right" /></a></div>
    </div>
    <nav aria-label="Informações sobre as avaliações" class="gr-policies"><a href="#/avaliacoes/privacidade">Privacidade das avaliações</a><a href="#/avaliacoes/termos">Termos de uso</a></nav>
  </section>
</template>

<style scoped>
.google-reviews { min-width: 0; }
.gr-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
.gr-heading .eyebrow { margin: 0 0 10px; }
.gr-heading h2 { margin: 0 0 12px; font-family: Georgia, serif; font-weight: 400; }
.gr-intro { color: #626a70; margin: 0; font-size: .95rem; }
.gr-source { flex-shrink: 0; padding: 10px 14px; border: 1px solid #e2ded7; border-radius: 8px; font-size: .85rem; font-style: normal; font-weight: 400; white-space: nowrap; color: #5e5e5e; letter-spacing: normal; }
.gr-heading-icon { font-size: 2.1rem; color: var(--color-primary); }
.gr-panel { display: grid; grid-template-columns: minmax(240px, .7fr) minmax(0, 2fr); gap: 28px; padding: 24px; border: 1px solid #dedbd5; border-radius: 16px; background: var(--color-surface-soft); }
.gr-overview { align-self: center; min-width: 0; padding-right: 8px; }
.gr-office { font-size: .85rem; font-weight: 500; line-height: 1.5; margin: 0 0 14px; overflow-wrap: anywhere; }
.gr-rating { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.gr-rating>strong { font: 400 3.4rem/1 Georgia, serif; color: var(--color-primary); letter-spacing: -.05em; }
.gr-rating p { color: #626a70; font-size: .73rem; line-height: 1.5; margin: 7px 0 0; }
.gr-overview-note { font-size: .83rem; color: #626a70; line-height: 1.7; }
.gr-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.gr-overview .gr-actions { flex-direction: column; align-items: stretch; }
.gr-button { display: inline-flex; align-items: center; justify-content: center; gap: 9px; border: 1px solid #cec4b7; border-radius: 7px; padding: 10px 14px; min-height: 44px; font-size: .8rem; font-weight: 500; transition: background .2s, color .2s, transform .2s; }
.gr-button:hover { background: #eee7dd; transform: translateY(-1px); }
.gr-button--primary { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.gr-button--primary:hover { background: var(--color-primary-dark); color: #fff; }
.gr-site-link { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; font-size: .74rem; color: var(--color-primary); }
.gr-reviews-area { min-width: 0; }
.gr-track { display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 18px) / 2); gap: 18px; overflow-x: auto; padding: 3px 2px 10px; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; scrollbar-width: thin; scrollbar-color: #b7a286 transparent; }
.gr-card { position: relative; display: flex; flex-direction: column; min-width: 0; padding: 22px 20px 16px; border: 1px solid #e2ded7; border-radius: 12px; background: #fff; scroll-snap-align: start; box-shadow: 0 6px 20px #0b254706; }
.gr-author { display: flex; align-items: center; gap: 10px; min-width: 0; margin-bottom: 18px; }
.gr-author>div:nth-child(2) { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.gr-avatar { display: grid; place-items: center; width: 44px; height: 44px; flex: 0 0 44px; border-radius: 50%; overflow: hidden; background: #f2ece3; color: var(--color-primary); font-size: .8rem; }
.gr-avatar img { width: 100%; height: 100%; object-fit: cover; }
.gr-author h3 { font-size: .87rem; font-weight: 500; line-height: 1.35; margin: 0 0 4px; }
.gr-author p { font-size: .7rem; color: #626a70; margin: 0; }
.gr-author>i { color: #bc9e70; font-size: 1.7rem; flex-shrink: 0; }
.gr-review-body { flex: 1; margin-top: 16px; }
.gr-review-text { font-size: .88rem; line-height: 1.8; color: #39454d; margin: 0; white-space: pre-line; overflow-wrap: anywhere; }
.gr-more { min-height: 44px; padding: 8px 0; color: var(--color-primary); font-size: .78rem; text-align: left; text-decoration: underline; }
.gr-textless, .gr-visit { color: #626a70; font-size: .78rem; margin: 0; }
.gr-visit { margin-top: 10px; }
.gr-translation { display: flex; flex-wrap: wrap; align-items: center; gap: 5px 12px; margin-top: 8px; font-size: .7rem; color: #626a70; }
.gr-translation button { color: var(--color-primary); min-height: 44px; padding: 0; text-decoration: underline; }
.gr-card-links { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; margin-top: 18px; padding-top: 10px; border-top: 1px solid #e9e4dc; }
.gr-card-links a { display: inline-flex; align-items: center; gap: 5px; min-height: 44px; color: var(--color-primary); font-size: .7rem; }
.gr-card-links a:last-child:has(.mdi-flag-outline) { justify-content: center; width: 44px; font-size: 1rem; }
.gr-navigation { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 2px 0; }
.gr-navigation p { font-size: .75rem; color: #626a70; margin: 0; }
.gr-navigation>div { display: flex; gap: 8px; }
.gr-navigation button { width: 44px; height: 44px; border: 1px solid #cec4b7; border-radius: 50%; color: var(--color-primary); }
.gr-navigation button:disabled { opacity: .4; }
.gr-navigation button:hover:not(:disabled) { background: var(--color-primary); color: #fff; }
.gr-attribution { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; padding: 18px 2px 0; color: #5e5e5e; }
.gr-attribution>span { font-size: .8rem; font-weight: 400; white-space: nowrap; letter-spacing: normal; }
.gr-attribution p, .gr-attribution a { font-size: .72rem; margin: 0; }
.gr-attribution a { text-decoration: underline; }
.gr-policies { display: flex; flex-wrap: wrap; gap: 4px 18px; margin-top: 8px; }
.gr-policies a { display: flex; align-items: center; min-height: 44px; font-size: .7rem; text-decoration: underline; color: #626a70; }
.gr-fallback, .gr-empty { border: 1px solid #e2ded7; border-radius: 12px; padding: 28px; background: var(--color-surface-soft); }
.gr-fallback { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; }
.gr-fallback>i, .gr-empty>i { font-size: 2rem; color: var(--color-primary); }
.gr-fallback>div:first-of-type { flex: 1 1 300px; }
.gr-fallback h3, .gr-empty h3 { font-size: 1.1rem; font-weight: 500; margin: 0 0 8px; }
.gr-fallback p, .gr-empty p { font-size: .86rem; color: #626a70; margin: 0; }
.gr-fallback--error { background: #fff8ec; }
.gr-empty { height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 12px; background: #fff; }
.gr-loading>p { font-size: .85rem; color: #626a70; }
.gr-skeletons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.gr-skeleton { min-height: 180px; border-radius: 12px; background: linear-gradient(100deg, #ebe7e0 30%, #f7f5f0 45%, #ebe7e0 60%); background-size: 200% 100%; animation: reviews-loading 1.6s ease-in-out infinite; }
@keyframes reviews-loading { to { background-position: -200% 0; } }

.google-reviews--compact { margin-top: 28px; }
.google-reviews--compact .gr-heading { margin-bottom: 14px; gap: 10px; }
.google-reviews--compact .gr-heading h2 { font-family: inherit; font-size: .93rem; font-weight: 500; letter-spacing: 0; margin: 0; }
.google-reviews--compact .gr-source { font-size: .75rem; padding: 0; border: 0; }
.google-reviews--compact .gr-panel { grid-template-columns: 1fr; padding: 18px; border-radius: 12px; }
.google-reviews--compact .gr-overview { padding: 0; }
.google-reviews--compact .gr-office { font-size: .74rem; margin-bottom: 10px; }
.google-reviews--compact .gr-rating { margin-bottom: 16px; }
.google-reviews--compact .gr-rating>strong { font-size: 2.6rem; }
.google-reviews--compact .gr-overview .gr-actions { flex-direction: row; }
.google-reviews--compact .gr-button { flex: 1 1 135px; font-size: .72rem; padding-inline: 10px; }
.google-reviews--compact .gr-site-link { flex-basis: 100%; min-height: 32px; }
.google-reviews--compact .gr-fallback { gap: 10px; padding: 16px; }
.google-reviews--compact .gr-fallback>i { font-size: 1.5rem; }
.google-reviews--compact .gr-fallback>div:first-of-type { flex-basis: 200px; }
.google-reviews--compact .gr-fallback h3 { font-size: .85rem; }
.google-reviews--compact .gr-fallback p { font-size: .75rem; }
.google-reviews--compact .gr-skeletons { grid-template-columns: 1fr; }
.google-reviews--compact .gr-skeleton { min-height: 130px; }
.google-reviews--compact .gr-attribution { padding-top: 10px; }
.google-reviews--compact .gr-policies { gap: 4px 14px; }
.google-reviews--compact .gr-policies a { font-size: .65rem; }

@media (max-width: 1000px) {
  .gr-panel { grid-template-columns: minmax(200px, .65fr) minmax(0, 1fr); padding: 20px; gap: 22px; }
  .gr-track { grid-auto-columns: calc(100% - 20px); }
}
@media (max-width: 700px) {
  .gr-heading { align-items: flex-start; flex-wrap: wrap; margin-bottom: 22px; gap: 12px; }
  .gr-heading h2 { font-size: 1.65rem; }
  .gr-intro { font-size: .85rem; }
  .gr-source { padding: 6px 10px; }
  .gr-panel { grid-template-columns: 1fr; padding: 18px; gap: 24px; }
  .gr-overview { padding: 0; }
  .gr-overview .gr-actions { flex-direction: row; }
  .gr-button { flex: 1 1 140px; }
  .gr-rating>strong { font-size: 3rem; }
  .gr-track { grid-auto-columns: calc(100% - 12px); }
  .gr-card { padding: 20px 16px 14px; }
  .gr-navigation p>span { display: none; }
  .gr-navigation { justify-content: center; }
  .gr-fallback { padding: 20px; }
  .gr-skeletons { grid-template-columns: 1fr; }
  .gr-skeleton:nth-child(2) { display: none; }
}
@media (prefers-reduced-motion: reduce) { .gr-skeleton { animation: none; } .gr-button { transition: none; } }
.gr-track.gr-track--single { grid-auto-columns: 100%; }
:global(.accessible-contrast .gr-rating>strong) { color: #fff !important; }
:global(.accessible-contrast .gr-more),
:global(.accessible-contrast .gr-translation button) { color: #ffeb3b !important; }
:global(.accessible-contrast .gr-panel),
:global(.accessible-contrast .gr-card),
:global(.accessible-contrast .gr-fallback),
:global(.accessible-contrast .gr-empty),
:global(.accessible-contrast .gr-avatar),
:global(.accessible-contrast .gr-button) { background: #000 !important; border-color: #fff !important; color: #fff !important; }
:global(.accessible-contrast .gr-source),
:global(.accessible-contrast .gr-attribution),
:global(.accessible-contrast .gr-policies a) { color: #fff !important; }
:global(.accessible-contrast .gr-card i),
:global(.accessible-contrast .gr-navigation button),
:global(.accessible-contrast .gr-actions i) { color: #ffeb3b !important; }
:global(.accessible-contrast .gr-source),
:global(.accessible-contrast .gr-card-links),
:global(.accessible-contrast .gr-navigation button) { border-color: #fff !important; }
</style>
