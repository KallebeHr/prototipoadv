<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { siteConfig as c } from '../config/siteConfig'

const activeIndex = ref(Math.floor(c.team.length / 2))
const track = ref(null)
const cards = ref([])
let scrollFrame
let resizeObserver
let resizeFrame
let cardWidth = 0
let gap = 24

function measureTrack() {
  const element = track.value
  if (!element) return
  const width = element.clientWidth
  gap = width < 600 ? 16 : 24
  cardWidth = width >= 960 ? (width - gap * 2) / 3 : width >= 600 ? width * .58 : width * .86
  element.style.setProperty('--card-width', `${cardWidth}px`)
  element.style.setProperty('--edge-space', `${Math.max(0, (width - cardWidth) / 2)}px`)
  element.style.setProperty('--team-gap', `${gap}px`)
  selectPerson(Math.min(activeIndex.value, Math.max(0, c.team.length - 1)), 'instant')
}

function registerCard(element, index) {
  cards.value[index] = element
}

function selectPerson(index, behavior = 'smooth') {
  if (index < 0 || index >= c.team.length) return
  activeIndex.value = index
  // Scroll only this container: never move the page on mount or selection.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  track.value?.scrollTo({ left: index * (cardWidth + gap), behavior: reduced ? 'instant' : behavior })
}

function updateActiveCard() {
  cancelAnimationFrame(scrollFrame)
  scrollFrame = requestAnimationFrame(() => {
    if (!track.value) return
    const center = track.value.getBoundingClientRect().left + track.value.clientWidth / 2
    let nearestIndex = 0
    let nearestDistance = Infinity

    cards.value.forEach((card, index) => {
      if (!card || index >= c.team.length) return
      const bounds = card.getBoundingClientRect()
      const distance = Math.abs(bounds.left + bounds.width / 2 - center)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })
    activeIndex.value = nearestIndex
  })
}

onMounted(async () => {
  await nextTick()
  measureTrack()
  resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(measureTrack)
  })
  resizeObserver.observe(track.value)
})

watch(() => c.team.length, async () => { await nextTick(); measureTrack() })
onBeforeUnmount(() => {
  cancelAnimationFrame(scrollFrame)
  cancelAnimationFrame(resizeFrame)
  resizeObserver?.disconnect()
})
</script>

<template>
  <section id="equipe" class="content-section team-section" aria-labelledby="team-title">
    <div class="team-heading">
      <div>
        <p class="eyebrow">QUEM SOMOS</p>
        <h2 id="team-title">Uma equipe que escuta e orienta</h2>
      </div>

      <div v-if="c.team.length > 1" class="team-controls" aria-label="Controles da equipe">
        <button type="button" :disabled="activeIndex === 0" aria-label="Profissional anterior" @click="selectPerson(activeIndex - 1)">
          <i class="mdi mdi-arrow-left" aria-hidden="true" />
        </button>
        <span aria-live="polite"><strong>{{ activeIndex + 1 }}</strong> / {{ c.team.length }}</span>
        <button type="button" :disabled="activeIndex === c.team.length - 1" aria-label="Próximo profissional" @click="selectPerson(activeIndex + 1)">
          <i class="mdi mdi-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div class="team-carousel" role="region" aria-roledescription="carrossel" aria-label="Profissionais do escritório">
      <div ref="track" class="team-carousel__track" tabindex="0" aria-label="Equipe: use as setas para navegar" @scroll.passive="updateActiveCard"
        @keydown.right.prevent="selectPerson(activeIndex + 1)" @keydown.left.prevent="selectPerson(activeIndex - 1)"
        @keydown.home.prevent="selectPerson(0)" @keydown.end.prevent="selectPerson(c.team.length - 1)">
        <article
          v-for="(person, index) in c.team"
          :key="`${person.name}-${person.role}-${index}`"
          :ref="element => registerCard(element, index)"
          class="team-card"
          :class="{ 'team-card--active': activeIndex === index }"
          :aria-label="`${index + 1} de ${c.team.length}: ${person.name}`"
        >
          <div class="team-card__photo">
            <img :src="person.photo" :alt="person.name" loading="lazy">
            <span aria-hidden="true">0{{ index + 1 }}</span>
          </div>
          <div class="team-card__content">
            <p class="team-card__role">{{ person.role }}</p>
            <h3>{{ person.name }}</h3>
            <p class="team-card__description">{{ person.description }}</p>
            <a v-if="c.professionalProfiles?.[index]?.slug" class="text-link" :href="`#/equipe/${c.professionalProfiles[index].slug}`">Conhecer profissional <i class="mdi mdi-arrow-right" aria-hidden="true" /></a>
          </div>
        </article>
      </div>
    </div>

    <div v-if="c.team.length > 1" class="team-dots" aria-label="Selecionar profissional">
      <button
        v-for="(person, index) in c.team"
        :key="`${person.name}-${index}`"
        type="button"
        :class="{ active: activeIndex === index }"
        :aria-label="`Exibir ${person.name}`"
        :aria-current="activeIndex === index ? 'true' : undefined"
        @click="selectPerson(index)"
      />
    </div>
  </section>
</template>

<style scoped>
.team-section {
  --team-gap: clamp(18px, 2.4vw, 32px);
  overflow: hidden;
}

.team-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 34px;
}

.team-heading .eyebrow,
.team-heading h2 {
  margin-bottom: 0;
}

.team-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 0 0 auto;
}

.team-controls button {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--color-primary), transparent 62%);
  border-radius: 50%;
  color: var(--color-primary);
  transition: color .25s ease, background-color .25s ease, transform .25s ease;
}

.team-controls button:not(:disabled):hover {
  color: #fff;
  background: var(--color-primary);
  transform: translateY(-2px);
}

.team-controls span {
  min-width: 42px;
  color: #7a8388;
  font-size: .78rem;
  text-align: center;
}

.team-controls strong {
  color: var(--color-primary);
  font-size: 1rem;
}

.team-carousel {
  padding: 25px 3px 28px;
}

.team-carousel__track {
  display: flex;
  align-items: stretch;
  gap: var(--team-gap);
  overflow-x: auto;
  padding: 28px var(--edge-space, 0px);
  margin: -28px 0;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 0;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
}

.team-carousel__track::-webkit-scrollbar {
  display: none;
}

.team-card {
  flex: 0 0 var(--card-width, 300px);
  width: var(--card-width, 300px);
  min-width: 0;
  background: #fff;
  border: 1px solid #e1e5e4;
  box-shadow: 0 10px 34px rgb(27 47 40 / 7%);
  scroll-snap-align: center;
  transform: scale(.94);
  opacity: 1;
  transition: transform .45s cubic-bezier(.22, 1, .36, 1), opacity .35s ease, box-shadow .35s ease, border-color .35s ease;
}

.team-card--active {
  z-index: 2;
  opacity: 1;
  transform: scale(1);
  border-color: color-mix(in srgb, var(--color-primary), transparent 55%);
  box-shadow: 0 22px 52px rgb(27 47 40 / 16%);
}

.team-card__photo {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3.45;
  background: #e9ecea;
}

.team-card__photo::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 38%;
  background: linear-gradient(transparent, rgb(16 31 26 / 52%));
  pointer-events: none;
}

.team-card__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  filter: saturate(.84);
  transition: transform .7s cubic-bezier(.22, 1, .36, 1), filter .35s ease;
}

.team-card--active .team-card__photo img {
  filter: saturate(1);
  transform: scale(1.025);
}

.team-card__photo span {
  position: absolute;
  right: 18px;
  bottom: 12px;
  z-index: 1;
  color: #fff;
  font: 500 .78rem/1 Georgia, serif;
  letter-spacing: .14em;
}

.team-card__content {
  padding: 22px 24px 24px;
  overflow-wrap: anywhere;
}

.team-card__role {
  color: var(--color-primary);
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .09em;
  margin: 0 0 7px;
  text-transform: uppercase;
}

.team-card h3 {
  font: 500 clamp(1.15rem, 1.7vw, 1.4rem)/1.2 Georgia, serif;
  margin: 0;
}

.team-card__description {
  color: #65716d;
  font-size: .88rem;
  line-height: 1.65;
  margin: 12px 0 0;
}

.team-dots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.team-dots button {
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 20px;
  background: transparent;
  transition: width .3s ease, background-color .3s ease;
}

.team-dots button::after {
  content: '';
  display: block;
  margin: auto;
  width: 8px;
  height: 8px;
  border-radius: 20px;
  background: #737e79;
}
.team-dots button.active::after {
  width: 28px;
  background: var(--color-primary);
}

@media (max-width: 700px) {
  .team-heading {
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .team-controls span {
    display: none;
  }

  .team-controls {
    gap: 8px;
    padding-top: 3px;
  }

  .team-controls button {
    width: 40px;
    height: 40px;
  }

  .team-carousel {
    padding-block: 18px 22px;
  }

  .team-carousel__track {
    padding-block: 24px;
    margin: -24px 0;
  }

  .team-card {
    transform: scale(.96);
  }

  .team-card--active {
    transform: scale(1);
  }

  .team-card__photo {
    aspect-ratio: 4 / 3.7;
  }

  .team-card__content {
    padding: 20px;
  }
}

:global(.accessible-contrast) .team-card {
  background: #000;
  color: #fff;
  border-color: #fff;
}
:global(.accessible-contrast) .team-controls button {
  color: #ffeb3b;
  border-color: #ffeb3b;
}
:global(.accessible-contrast) .team-dots button::after {
  background: #fff;
}
:global(.accessible-contrast) .team-dots button.active::after {
  background: #ffeb3b;
}

@media (prefers-reduced-motion: reduce) {
  .team-card,
  .team-card__photo img,
  .team-controls button,
  .team-dots button {
    transition: none;
  }
}
</style>
