<script setup>
  import { computed, nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue'
  import GoogleReviewsPolicy from './components/GoogleReviewsPolicy.vue'
  import InstitutionalSite from './components/InstitutionalSite.vue'
  import LinkBioPage from './components/LinkBioPage.vue'
  import ProfessionalPage from './components/ProfessionalPage.vue'
  import { siteConfig } from './config/siteConfig'
  const hash = ref(window.location.hash)
  const profileSlug = computed(() => hash.value.startsWith('#/equipe/') ? hash.value.slice(9) : '')
  const isLinkBio = computed(() => /^#\/(linkbio|bio|links)\/?$/i.test(hash.value))
  const reviewsPolicy = computed(() => hash.value.match(/^#\/avaliacoes\/(privacidade|termos)\/?$/)?.[1] || '')
  const page = computed(() => {
    if (reviewsPolicy.value) return 'policy'
    if (isLinkBio.value) return 'bio'
    return profileSlug.value ? 'profile' : 'home'
  })
  async function updateRoute () {
    const previousPage = page.value
    hash.value = window.location.hash
    await nextTick()
    if (page.value !== 'home') window.scrollTo({ top: 0, behavior: 'instant' })
    else if (previousPage !== 'home') {
      const sectionId = hash.value.slice(1)
      const section = sectionId ? document.querySelector(`#${CSS.escape(sectionId)}`) : null
      if (section) section.scrollIntoView({ behavior: 'instant' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }
  onMounted(() => window.addEventListener('hashchange', updateRoute))
  onUnmounted(() => window.removeEventListener('hashchange', updateRoute))
  watchEffect(() => {
    for (const [key, value] of Object.entries(siteConfig.theme)) document.documentElement.style.setProperty(`--color-${key.replace(/[A-Z]/g, l => `-${l.toLowerCase()}`)}`, value)
    document.querySelector('link[rel="icon"]')?.setAttribute('href', siteConfig.brand.favicon)
    const profileIndex = siteConfig.professionalProfiles.findIndex(p => p.slug === profileSlug.value)
    if (reviewsPolicy.value) document.title = `${reviewsPolicy.value === 'privacidade' ? 'Privacidade' : 'Termos de uso'} das avaliações | ${siteConfig.brand.shortName}`
    else if (isLinkBio.value) document.title = `${siteConfig.brand.shortName} | Contatos e links`
    else if (profileSlug.value && siteConfig.team[profileIndex]) document.title = `${siteConfig.team[profileIndex].name} | ${siteConfig.brand.officeName}`
    else document.title = siteConfig.seo.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', isLinkBio.value ? siteConfig.linkBio.description : siteConfig.seo.description)
  })
</script>
<template>
  <GoogleReviewsPolicy v-if="reviewsPolicy" :key="reviewsPolicy" :kind="reviewsPolicy" />
  <LinkBioPage v-else-if="isLinkBio" />
  <ProfessionalPage v-else-if="profileSlug" :key="profileSlug" :slug="profileSlug" />
  <InstitutionalSite v-else />
</template>
