<script setup>
  import gsap from 'gsap'
  import { onMounted, onUnmounted, ref } from 'vue'
  import { siteConfig as c, whatsappUrl } from '../config/siteConfig'
  import AccessibilityMenu from './AccessibilityMenu.vue'
  import ContactSection from './ContactSection.vue'
  import FooterSection from './FooterSection.vue'
  import GoogleReviewsSection from './GoogleReviewsSection.vue'
  import HeaderNavigation from './HeaderNavigation.vue'
  import PracticeAreas from './PracticeAreas.vue'
  import TeamSection from './TeamSection.vue'

  const bubble = ref(false)
  const dismissed = ref(false)
  const messageIndex = ref(0)
  let firstTimer
  let intervalTimer
  let hideTimer
  let motion

  function showBubble () {
    if (dismissed.value || document.hidden) return
    bubble.value = true
    hideTimer = setTimeout(() => {
      bubble.value = false
      messageIndex.value++
    }, 9000)
  }

  onMounted(() => {
    motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.editorial-photo', { y: 10 }, { y: 0, duration: 0.65, ease: 'power2.out', clearProps: 'transform' })
    })
    firstTimer = setTimeout(showBubble, c.whatsappWidget.firstDelay)
    intervalTimer = setInterval(showBubble, c.whatsappWidget.interval)
  })

  onUnmounted(() => {
    motion?.revert()
    clearTimeout(firstTimer)
    clearTimeout(hideTimer)
    clearInterval(intervalTimer)
  })
</script>

<template>
  <a class="skip-link" href="#main-content">Pular para o conteúdo</a>
  <HeaderNavigation />

  <section class="hero" :style="{ backgroundImage: `url(${c.hero.backgroundImage})` }">
    <div class="wrap">
      <p>{{ c.hero.eyebrow }}</p>
      <h1>{{ c.hero.title }}</h1>
      <span>{{ c.hero.subtitle }}</span>
    </div>
  </section>

  <main id="main-content" class="wrap" tabindex="-1">
    <div class="editorial-layout">
      <article id="escritorio">
        <img
          :alt="c.about.photoAlt"
          class="editorial-photo"
          height="880"
          :src="c.about.photo"
          width="1600"
        >
        <p class="eyebrow">O ESCRITÓRIO</p>
        <h2>{{ c.about.title }}</h2>
        <p class="lead">{{ c.about.subtitle }}</p>
        <p>{{ c.about.text }}</p>
        <a class="text-link" href="#equipe">Conheça nossa equipe <i aria-hidden="true" class="mdi mdi-arrow-right" /></a>
      </article>
      <aside aria-label="Nossas especialidades" class="practice-sidebar">
        <h2>Como podemos ajudar?</h2>
        <p>Conheça nossas áreas de atuação</p>
        <a v-for="(area, index) in c.practiceAreas" :key="area.title" :href="`#area-${index}`">
          {{ area.title }}<i aria-hidden="true" class="mdi mdi-chevron-right" />
        </a>
        <a class="outline-button" href="#contato">Entre em contato <i aria-hidden="true" class="mdi mdi-arrow-right" /></a>
        <div class="sidebar-note">
          <i aria-hidden="true" class="mdi mdi-message-text-outline" />
          <p>Orientação clara.<br>Atendimento próximo.</p>
          <small>{{ c.contact.businessHours }}</small>
        </div>
      </aside>
    </div>

    <PracticeAreas />
    <TeamSection />
    <GoogleReviewsSection />
    <ContactSection />
  </main>

  <FooterSection />

  <Teleport to="body">
  <div class="whatsapp-widget">
    <div v-if="bubble" class="whatsapp-bubble">
      <button aria-label="Não mostrar mais mensagens" @click="dismissed = true; bubble = false">
        <i aria-hidden="true" class="mdi mdi-close" />
      </button>
      <p>{{ c.whatsappWidget.messages[messageIndex % c.whatsappWidget.messages.length] }}</p>
      <a :href="whatsappUrl()" rel="noopener" target="_blank">Iniciar conversa</a>
    </div>
    <a
      aria-label="Conversar pelo WhatsApp (abre em nova aba)"
      class="whatsapp-button"
      :href="whatsappUrl()"
      rel="noopener"
      target="_blank"
    >
      <i aria-hidden="true" class="mdi mdi-whatsapp" />
    </a>
  </div>

  </Teleport>

  <AccessibilityMenu />
</template>
