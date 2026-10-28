
<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { siteConfig as c, whatsappUrl } from '../config/siteConfig'

const menu = ref(false)
const query = ref('')
const searched = ref(false)
const menuClose = ref(null)
const menuOpen = ref(null)

const links = computed(() => [
  ['Início', '#inicio'],
  ['O escritório', '#escritorio'],
  ['Áreas de atuação', '#areas'],
  ['Nossa equipe', '#equipe'],
  ...(c.googleReviews?.enabled
    ? [['Avaliações', '#avaliacoes']]
    : []),
  ['Localização', '#localizacao'],
  ['Contato', '#contato'],
])

const normalize = value =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()

const results = computed(() => {
  const term = normalize(query.value.trim())
  if (!term) return []

  return [
    ...c.practiceAreas.map((area, index) => ({
      title: area.title,
      text: area.description,
      href: `#area-${index}`,
    })),
    {
      title: c.about.title,
      text: c.about.text,
      href: '#escritorio',
    },
    {
      title: 'Contato e atendimento',
      text: `${c.contact.address} ${c.contact.email}`,
      href: '#contato',
    },
    {
      title: 'Agendamento e triagem',
      text: 'Solicitar atendimento presencial ou por vídeo',
      href: '#agendamento',
    },
    {
      title: 'Checklist de documentos',
      text: 'Preparar documentos para o atendimento',
      href: '#documentos',
    },
    ...(c.googleReviews?.enabled
      ? [{
          title: 'Avaliações no Google',
          text: 'Opiniões sobre o escritório e avaliação do atendimento',
          href: '#avaliacoes',
        }]
      : []),
    ...c.faq.map(item => ({
      title: item.question,
      text: item.answer,
      href: '#duvidas',
    })),
  ].filter(item =>
    normalize(`${item.title} ${item.text}`).includes(term)
  )
})

watch(menu, async value => {
  document.body.classList.toggle('menu-is-open', value)

  if (value) {
    await nextTick()
    if (menu.value) menuClose.value?.focus()
  } else {
    menuOpen.value?.focus()
  }
})

function closeMenu() {
  menu.value = false
}

function submitSearch() {
  searched.value = true
  closeMenu()
}

function trapMenuFocus(event) {
  if (!menu.value) return

  const items = [
    ...event.currentTarget.querySelectorAll(
      'a[href], button:not([disabled])'
    ),
  ]

  const first = items[0]
  const last = items.at(-1)

  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (
    !event.shiftKey &&
    document.activeElement === last
  ) {
    event.preventDefault()
    first.focus()
  }
}

onUnmounted(() => {
  document.body.classList.remove('menu-is-open')
})
</script>

<template>
  <header
    id="inicio"
    class="site-header"
    :style="{
      '--header-primary': c.theme.primary,
      '--header-secondary': c.theme.secondary,
      '--header-accent': c.theme.accent,
    }"
  >
    <!-- BARRA SUPERIOR -->
    <div class="topbar wrap">
      <span class="top-note">
        Ética. Proximidade. Compromisso.
      </span>

      <button
        ref="menuOpen"
        type="button"
        class="menu-toggle icon-button"
        aria-controls="navigation"
        :aria-expanded="menu"
        :aria-label="menu ? 'Menu aberto' : 'Abrir menu principal'"
        @click="menu = true"
      >
        <i aria-hidden="true" class="mdi mdi-menu" />
      </button>

      <!-- NAVEGAÇÃO -->
      <nav
        id="navigation"
        aria-label="Navegação principal"
        :class="{ expanded: menu }"
        @keydown.esc="closeMenu"
        @keydown.tab="trapMenuFocus"
      >
        <div class="mobile-menu-head">
          <a
            class="mobile-brand"
            href="#inicio"
            @click="closeMenu"
          >
<span class="monogram">
  <img
    v-if="c.brand.logo"
    :src="c.brand.logo"
    :alt="c.brand.shortName"
    class="mobile-menu-logo"
  />
  <span v-else>{{ c.brand.initials }}</span>
</span>

            <span class="mobile-brand-text">
              {{ c.brand.shortName }}
              <small>ADVOCACIA E CONSULTORIA JURÍDICA</small>
            </span>
          </a>

          <button
            ref="menuClose"
            type="button"
            class="mobile-close"
            aria-label="Fechar menu principal"
            @click="closeMenu"
          >
            <i aria-hidden="true" class="mdi mdi-close" />
          </button>
        </div>

        <p class="mobile-menu-label">
          NAVEGUE PELO SITE
        </p>

        <a
          v-for="([label, href], index) in links"
          :key="href"
          :href="href"
          :style="{ '--menu-index': index } "
          @click="closeMenu"
        >
          <span class="menu-number">
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <span class="menu-link-text">
            {{ label }}
          </span>

          <i
            aria-hidden="true"
            class="mdi mdi-arrow-right menu-arrow"
          />
        </a>

        <div class="mobile-menu-contact">
          <a :href="`tel:+${c.contact.phoneRaw}`">
            <i
              aria-hidden="true"
              class="mdi mdi-phone-outline"
            />
            {{ c.contact.phone }}
          </a>

          <a
            :href="whatsappUrl()"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i
              aria-hidden="true"
              class="mdi mdi-whatsapp"
            />
            WhatsApp
          </a>
        </div>
      </nav>
    </div>

    <!-- CABEÇALHO PRINCIPAL -->
    <div class="masthead">
      <div class="wrap masthead-inner">

        <!-- LOGO -->
        <a
          :aria-label="`${c.brand.officeName} — início`"
          class="brand"
          href="#inicio"
        >
          <img
            v-if="c.brand.logo"
            :src="c.brand.logo"
            :alt="c.brand.officeName"
            class="brand-logo"
          />

          <span v-else class="monogram">
            {{ c.brand.initials }}
          </span>

          <span class="brand-info">
            <span class="brand-name">
              {{ c.brand.shortName }}
            </span>
            <small>ADVOCACIA E CONSULTORIA JURÍDICA</small>
          </span> 
        </a>

        <!-- PESQUISA -->
        <form
          class="search"
          role="search"
          @submit.prevent="submitSearch"
        >
          <label class="sr-only" for="site-search">
            Pesquisar no site
          </label>

          <input
            id="site-search"
            v-model="query"
            type="search"
            placeholder="O que você procura?"
            autocomplete="off"
            @keydown.esc="searched = false"
          />

          <button
            type="submit"
            aria-label="Pesquisar"
            title="Pesquisar"
          >
            <i
              aria-hidden="true"
              class="mdi mdi-magnify"
            />
          </button>
        </form>

        <!-- TELEFONE -->
        <a
          class="header-phone"
          :href="`tel:+${c.contact.phoneRaw}`"
        >
          <i
            aria-hidden="true"
            class="mdi mdi-phone-outline"
          />

          <span class="phone-info">
            <small>Fale com nosso escritório</small>
            {{ c.contact.phone }}
          </span>
        </a>
      </div>
    </div>
  </header>

  <!-- RESULTADOS DA PESQUISA -->
  <section
    v-if="searched"
    aria-label="Resultados da pesquisa"
    class="search-results wrap"
  >
    <div class="results-header">
      <h2>Resultados da pesquisa</h2>

      <button
        type="button"
        class="close-results"
        @click="searched = false"
      >
        Fechar pesquisa
        <i aria-hidden="true" class="mdi mdi-close" />
      </button>
    </div>

    <p role="status" class="results-count">
      {{
        query.trim()
          ? `${results.length} resultado(s) para “${query}”`
          : 'Digite uma palavra para pesquisar.'
      }}
    </p>

    <div class="results-list">
      <a
        v-for="result in results"
        :key="result.title + result.href"
        :href="result.href"
        @click="searched = false"
      >
        <span>{{ result.title }}</span>
        <small>{{ result.text }}</small>
        <i
          aria-hidden="true"
          class="mdi mdi-arrow-right"
        />
      </a>
    </div>

    <p
      v-if="query.trim() && results.length === 0"
      class="empty-results"
    >
      Nenhum resultado encontrado. Tente pesquisar
      por outra palavra.
    </p>
  </section>
</template>

<style scoped>
/* =========================================
   ESTRUTURA
========================================= */

.site-header {
  width: 100%;
  min-width: 0;
  position: relative;
  z-index: 100;
}

.site-header *,
.search-results * {
  box-sizing: border-box;
}

.wrap {
  width: min(1200px, calc(100% - 40px));
  margin-inline: auto;
}

:global(body.menu-is-open) {
  overflow: hidden;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* =========================================
   TOPBAR
========================================= */

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  gap: 18px;
}

.top-note {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.topbar nav#navigation {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(10px, 1.5vw, 25px);
  min-width: 0;
}

.topbar nav#navigation > a {
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.2s ease;
}
.topbar nav#navigation > a .menu-link-text {
  display: inline;
  font-size: inherit;
  color: inherit;
  letter-spacing: normal;
}
.topbar nav#navigation > a:hover {
  color: var(--header-accent, #b79a65);
}

.menu-toggle,
.mobile-menu-head,
.mobile-menu-label,
.mobile-menu-contact,
.menu-number,
.menu-arrow {
  display: none;
  
}

/* =========================================
   MASTHEAD DESKTOP
========================================= */

.masthead {
  width: 100%;
  background: var(--header-primary, #18392e);
}

.masthead .masthead-inner {
  display: grid;
  grid-template-columns:
    minmax(0, auto)
    minmax(180px, 1fr)
    minmax(0, auto);
  align-items: center;
  gap: clamp(16px, 2.5vw, 40px);
  padding-block: 19px;
  min-height: 94px;
}

/* =========================================
   LOGO
========================================= */

.masthead .brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  width: auto;
  max-width: 100%;
  text-decoration: none;
  color: #fff;
}

.brand-logo {
  display: block;
  flex-shrink: 0;
  width: 62px;
  height: 58px;
  max-width: none;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.monogram {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  line-height: 1.2;
}

.brand-name {
  display: block;
  font-size: clamp(0.9rem, 1.4vw, 1.2rem);
  font-weight: 650;
  letter-spacing: 0.015em;
  line-height: 1.25;
}

.brand-info small {
  display: block;
  color: var(--header-accent, #b79a65);
  font-size: 0.63rem;
  font-weight: 600;
  letter-spacing: 0.17em;
}

/* =========================================
   PESQUISA
========================================= */

.masthead .search {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  min-width: 0;
  max-width: 480px;
  justify-self: center;
  height: 47px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search:focus-within {
  border-color: var(--header-accent, #b79a65);
  box-shadow: 0 0 0 3px rgba(183, 154, 101, 0.18);
}

.masthead .search input {
  display: block;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  height: 100%;
  margin: 0;
  padding: 0 12px 0 16px;
  color: #25352e;
  background: transparent;
  border: 0;
  border-radius: 0;
  outline: none;
  box-shadow: none;
  font-family: inherit;
  font-size: 0.88rem;
  line-height: normal;
}

.search input::placeholder {
  color: #717b75;
  opacity: 1;
}

.search input::-webkit-search-cancel-button {
  cursor: pointer;
}

.masthead .search button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 47px;
  width: 47px;
  height: 100%;
  margin: 0;
  padding: 0;
  color: var(--header-primary, #18392e);
  background: transparent;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search button:hover {
  background: #f0f3ef;
}
.mobile-brand .monogram {
  padding: 8px;
  overflow: hidden;
}
.mobile-brand .monogram .mobile-menu-logo {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  object-fit: contain;
  filter: brightness(0) invert(1);

}
.search button .mdi {
  font-size: 1.35rem;
}

/* =========================================
   CONTATO
========================================= */

.masthead .header-phone {
  display: inline-flex;
  align-items: center;
  justify-self: end;
  gap: 11px;
  width: auto;
  min-width: 0;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
}

.header-phone > .mdi {
  font-size: 1.7rem;
  color: var(--header-accent, #b79a65);
}

.phone-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 0.94rem;
  font-weight: 600;
}

.phone-info small {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.67rem;
  font-weight: 400;
}

/* =========================================
   TABLETS
========================================= */

@media (max-width: 1100px) {
  .masthead .masthead-inner {
    gap: 20px;
  }

  .brand-logo {
    width: 50px;
    height: 50px;
  }

  .brand-name {
    font-size: 0.95rem;
  }

  .phone-info {
    font-size: 0.82rem;
  }

  .phone-info small {
    font-size: 0.6rem;
  }
}

/* =========================================
   MENU MOBILE E TABLET
========================================= */

@media (max-width: 1024px) {
  .topbar {
    min-height: 43px;
  }

  .top-note {
    font-size: 0.72rem;
  }

  .menu-toggle {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    padding: 0;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: 7px;
    cursor: pointer;
  }

  .menu-toggle .mdi {
    font-size: 1.55rem;
  }

  .topbar nav#navigation {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;

    position: fixed;
    inset: 0;
    z-index: 9999;

    width: 100%;
    max-width: none;
    height: 100vh;
    height: 100dvh;
    margin: 0;
    padding:
      max(20px, env(safe-area-inset-top))
      max(22px, env(safe-area-inset-right))
      max(25px, env(safe-area-inset-bottom))
      max(22px, env(safe-area-inset-left));

    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;

    color: #18392e;
    background: #fafbf8;

    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(-12px);

    transition:
      opacity 0.25s ease,
      transform 0.25s ease,
      visibility 0.25s ease;
  }

  .topbar nav#navigation.expanded {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
  }

  .mobile-menu-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    width: 100%;
    padding-bottom: 25px;
    border-bottom: 1px solid #e4e9e2;
  }

  .mobile-brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    color: #18392e;
    text-decoration: none;
  }

  .mobile-brand .monogram {
    width: 48px;
    height: 48px;
    color: #fff;
    background: var(--header-primary, #18392e);
    border: 0;
  }

  .mobile-brand-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .mobile-brand-text small {
    color: var(--header-secondary, #5a7a68);
    font-size: 0.63rem;
    font-weight: 600;
    letter-spacing: 0.17em;
  }

  .mobile-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    padding: 0;
    color: #18392e;
    background: #edf1eb;
    border: 1px solid #dde5da;
    border-radius: 10px;
    cursor: pointer;
  }

  .mobile-close .mdi {
    font-size: 1.45rem;
  }

  .mobile-menu-label {
    display: block;
    margin: 30px 0 12px;
    color: #718477;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.15em;
  }

  .topbar nav#navigation > a {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 16px;
    min-height: 59px;
    padding: 14px 2px;
    color: #18392e;
    border-bottom: 1px solid #e6ebe4;
    text-decoration: none;
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    font-weight: 600;
    white-space: normal;
  }

  .topbar nav#navigation > a:hover {
    color: var(--header-secondary, #5a7a68);
  }

  .menu-number {
    display: inline-block;
    width: 28px;
    flex-shrink: 0;
    color: #889e8c;
    font-size: 0.72rem;
    font-weight: 500;
  }

  .menu-link-text {
    flex: 1;
    min-width: 0;
  }

  .menu-arrow {
    display: inline-block;
    margin-left: auto;
    color: #77927e;
    font-size: 1.15rem;
  }

  .mobile-menu-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    margin-top: auto;
    padding-top: 28px;
    flex-shrink: 0;
  }

  .mobile-menu-contact a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    flex: 1 1 150px;
    min-height: 47px;
    padding: 10px;
    color: #18392e;
    background: #edf1eb;
    border: 1px solid #e0e8dc;
    border-radius: 8px;
    text-decoration: none;
    font-size: 0.86rem;
    font-weight: 600;
  }

  .mobile-menu-contact a:last-child {
    color: #fff;
    background: #236b45;
    border-color: #236b45;
  }

  .mobile-menu-contact .mdi {
    font-size: 1.2rem;
  }
}

/* =========================================
   MOBILE - LOGO + PESQUISA LADO A LADO
========================================= */

@media (max-width: 700px) {
  .wrap {
    width: calc(100% - 28px);
  }

  .topbar {
    min-height: 39px;
  }

  .top-note {
    font-size: 0.65rem;
  }

  .menu-toggle {
    width: 38px;
    height: 38px;
  }

  .masthead .masthead-inner {
    display: grid;
    grid-template-columns:
      minmax(0, max-content)
      minmax(0, 1fr);

    align-items: center;
    justify-content: space-between;
    gap: 10px;

    width: calc(100% - 28px);
    min-height: 70px;
    padding-block: 10px;
  }

  /* Logo ocupa somente o espaço necessário */
  .masthead .brand {
    display: flex;
    align-items: center;
    gap: 7px;
    width: auto;
    max-width: min(45vw, 190px);
    min-width: 0;
    overflow: hidden;
  }

  .brand-logo {
    width: clamp(37px, 9vw, 49px);
    height: 44px;
    flex-shrink: 0;
  }

  .masthead .brand .monogram {
    width: 39px;
    height: 39px;
    font-size: 0.94rem;
    border-radius: 7px;
  }

  .brand-info {
    min-width: 0;
    gap: 3px;
    overflow: hidden;
  }

  .brand-name {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: clamp(0.76rem, 2.6vw, 0.95rem);
    line-height: 1.15;
  }

  .brand-info small {
    font-size: 0.5rem;
    letter-spacing: 0.12em;
  }

  /* Pesquisa na mesma linha da logo */
  .masthead .search {
    grid-column: 2;
    grid-row: 1;
    justify-self: stretch;

    width: 100%;
    max-width: none;
    min-width: 0;
    height: 40px;
    margin: 0;
    border-radius: 7px;
  }

  .masthead .search input {
    min-width: 0;
    width: 100%;
    padding-left: 10px;
    padding-right: 2px;
    font-size: 0.78rem;
  }

  .masthead .search button {
    flex-basis: 37px;
    width: 37px;
    height: 100%;
  }

  .search button .mdi {
    font-size: 1.2rem;
  }

  /* Telefone fica no menu mobile */
  .masthead .header-phone {
    display: none;
  }

  .mobile-menu-label {
    margin-top: 24px;
  }

  .topbar nav#navigation > a {
    min-height: 54px;
    padding-block: 12px;
    font-size: 1rem;
  }
}

/* =========================================
   CELULARES PEQUENOS
========================================= */

@media (max-width: 380px) {
  .masthead .masthead-inner {
    gap: 7px;
  }

  .masthead .brand {
    max-width: 47vw;
    gap: 5px;
  }

  .brand-logo {
    width: 35px;
    height: 37px;
  }

  .masthead .brand .monogram {
    width: 34px;
    height: 34px;
    font-size: 0.8rem;
  }

  .brand-name {
    font-size: 0.75rem;
  }

  .brand-info small {
    font-size: 0.44rem;
    letter-spacing: 0.08em;
  }

  .masthead .search {
    height: 37px;
  }

  .masthead .search input {
    padding-left: 8px;
    font-size: 0.73rem;
  }

  .masthead .search button {
    flex-basis: 32px;
    width: 32px;
  }

  .mobile-menu-contact {
    gap: 9px;
  }

  .mobile-menu-contact a {
    flex-basis: 100%;
  }
}

/* =========================================
   RESULTADOS DA PESQUISA
========================================= */

.search-results {
  position: relative;
  z-index: 50;
  padding-block: 26px 36px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.results-header h2 {
  margin: 0;
  color: #18392e;
  font-size: clamp(1.1rem, 2vw, 1.55rem);
}

.close-results {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 12px;
  color: #18392e;
  background: #eef2ed;
  border: 1px solid #dfe7dd;
  border-radius: 7px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8rem;
}

.close-results .mdi {
  font-size: 1.1rem;
}

.results-count {
  margin: 14px 0 20px;
  color: #66766b;
  font-size: 0.88rem;
}

.results-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.results-list a {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 5px 12px;
  padding: 16px 18px;
  color: #18392e;
  background: #fff;
  border: 1px solid #e1e8df;
  border-radius: 10px;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.results-list a:hover {
  border-color: #5a7a68;
  transform: translateY(-2px);
}

.results-list a > span {
  min-width: 0;
  font-size: 0.9rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.results-list a > small {
  grid-column: 1;
  color: #68796d;
  font-size: 0.77rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.results-list a > .mdi {
  grid-column: 2;
  grid-row: 1 / 3;
  color: #5a7a68;
  font-size: 1.2rem;
}

.empty-results {
  padding: 24px;
  color: #66766b;
  background: #f7f9f6;
  border-radius: 9px;
  text-align: center;
}

@media (max-width: 700px) {
  .search-results {
    padding-block: 20px 28px;
  }

  .results-list {
    grid-template-columns: minmax(0, 1fr);
  }

  .results-list a {
    padding: 14px;
  }

  .results-header {
    align-items: flex-start;
  }
}

/* =========================================
   ACESSIBILIDADE
========================================= */

.site-header a:focus-visible,
.site-header button:focus-visible,
.search-results a:focus-visible,
.search-results button:focus-visible {
  outline: 3px solid var(--header-accent, #b79a65);
  outline-offset: 3px;
}
/* Centraliza o menu superior somente no desktop */
@media (min-width: 1025px) {
  .topbar {
    justify-content: center;
  }

  .topbar nav#navigation {
    justify-content: center;
  }
}
@media (prefers-reduced-motion: reduce) {
  .site-header *,
  .search-results * {
    scroll-behavior: auto;
    animation: none !important;
    transition: none !important;
  }
}
</style>
