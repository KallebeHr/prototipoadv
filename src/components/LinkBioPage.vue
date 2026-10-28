<script setup>
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
  import { siteConfig as c } from '../config/siteConfig'
  import AccessibilityMenu from './AccessibilityMenu.vue'
  import GoogleReviewsSection from './GoogleReviewsSection.vue'

  const title = ref(null)
  const main = ref(null)
  const shareStatus = ref('')
  const failedImages = ref(new Set())
  const currentYear = new Date().getFullYear()
  let statusTimer

  const settings = computed(() => c.linkBio)
  const cover = computed(() => settings.value.coverImage || c.about.photo)
  const coverAlt = computed(() => settings.value.coverAlt || c.about.photoAlt)
  const quickLinks = computed(() => settings.value.quickLinks.filter(link => link.label && link.href))

  function contactLink (number, message) {
    const digits = String(number || '').replace(/\D/g, '')
    return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message || '')}` : ''
  }

  const officeWhatsapp = computed(() => contactLink(c.contact.whatsapp, settings.value.whatsappMessage || c.contact.whatsappMessage))
  const professionals = computed(() => c.team
    .map((person, index) => {
      const profile = c.professionalProfiles[index] || {}
      const personalNumber = String(profile.whatsapp || '').replace(/\D/g, '')
      return {
        ...person,
        key: profile.slug || `person-${index}`,
        registration: profile.registration,
        profileUrl: profile.slug ? `#/equipe/${profile.slug}` : '',
        contactUrl: personalNumber
          ? contactLink(personalNumber, `Olá, ${person.name}! Vim pelo link da bio e gostaria de informações sobre atendimento.`)
          : contactLink(c.contact.whatsapp, `Olá! Vim pelo link da bio e gostaria de falar com ${person.name} (${person.role}).`),
        personalContact: Boolean(personalNumber),
      }
    })
    .filter(person => person.linkBio !== false)
    .slice(0, 3))

  function initials (name) {
    return String(name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('')
  }

  function imageFailed (url) {
    failedImages.value = new Set([...failedImages.value, url])
  }

  function skipToContent () {
    main.value?.focus()
  }

  function notifyShare (message) {
    clearTimeout(statusTimer)
    shareStatus.value = message
    statusTimer = setTimeout(() => {
      shareStatus.value = ''
    }, 5000)
  }

  async function sharePage () {
    const url = new URL(window.location.href)
    url.hash = '/linkbio'
    const data = { title: c.brand.officeName, text: 'Contatos e links do escritório', url: url.href }
    if (navigator.share) {
      try {
        await navigator.share(data)
        return
      } catch (error) {
        if (error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url.href)
      notifyShare('Link copiado. Agora é só compartilhar!')
    } catch {
      notifyShare('Para compartilhar, copie o link na barra de endereço.')
    }
  }

  onMounted(async () => {
    await nextTick()
    title.value?.focus({ preventScroll: true })
  })
  onUnmounted(() => clearTimeout(statusTimer))
</script>

<template>
  <div class="bio-page">
    <a class="skip-link" href="#bio-content" @click.prevent="skipToContent">Pular para os contatos</a>

    <div class="bio-toolbar">
      <a class="bio-back" href="#inicio"><i aria-hidden="true" class="mdi mdi-arrow-left" /> Site do escritório</a>
      <button aria-label="Compartilhar link do escritório" class="bio-share" type="button" @click="sharePage">
        <i aria-hidden="true" class="mdi mdi-share-variant-outline" /><span>Compartilhar</span>
      </button>
    </div>
    <p aria-live="polite" class="bio-share-status" role="status">{{ shareStatus }}</p>

    <main id="bio-content" ref="main" class="bio-shell" tabindex="-1">
      <header class="bio-identity">
        <div class="bio-brand-block">
          <div class="bio-logo">
            <img
              v-if="c.brand.logo && !failedImages.has(c.brand.logo)"
              :alt="`Logo de ${c.brand.shortName}`"
              height="112"
              :src="c.brand.logo"
              width="112"
              @error="imageFailed(c.brand.logo)"
            >
            <span v-else aria-hidden="true">{{ c.brand.initials }}</span>
          </div>
          <div class="bio-brand-copy">
            <p class="bio-eyebrow">{{ settings.eyebrow }}</p>
            <h1 ref="title" tabindex="-1">{{ settings.title || c.brand.shortName }}</h1>
            <p class="bio-description">{{ settings.description }}</p>
          </div>
        </div>

        <div v-if="cover && !failedImages.has(cover)" class="bio-cover">
          <img
            :alt="coverAlt"
            fetchpriority="high"
            height="480"
            :src="cover"
            width="800"
            @error="imageFailed(cover)"
          >
          <span v-if="c.contact.city" class="bio-cover-caption"><i aria-hidden="true" class="mdi mdi-map-marker-outline" />{{ c.contact.city }}</span>
        </div>

        <div class="bio-office-info">
          <p class="bio-info-title"><i aria-hidden="true" class="mdi mdi-clock-outline" /> Atendimento</p>
          <p v-if="c.contact.businessHours">{{ c.contact.businessHours }}</p>
          <p v-if="c.contact.address" class="bio-address">{{ c.contact.address }}<span v-if="c.contact.city"> · {{ c.contact.city }}</span></p>
        </div>
        <div aria-hidden="true" class="bio-signature"><span />Ética. Proximidade. Compromisso.</div>
      </header>

      <div class="bio-content">
        <nav aria-label="Contatos e localização do escritório" class="bio-channels">
          <a
            v-if="officeWhatsapp"
            aria-label="Fale com a equipe pelo WhatsApp"
            class="bio-primary-link"
            :href="officeWhatsapp"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span class="bio-primary-icon"><i aria-hidden="true" class="mdi mdi-whatsapp" /></span>
            <span><strong>Fale pelo WhatsApp</strong><small>Converse com nossa equipe</small></span>
            <i aria-hidden="true" class="mdi mdi-arrow-top-right" />
          </a>

          <div v-if="c.social.instagram || c.contact.mapUrl" class="bio-social-grid">
            <a
              v-if="c.social.instagram"
              aria-label="Instagram do escritório"
              class="bio-social-link"
              :href="c.social.instagram"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i aria-hidden="true" class="mdi mdi-instagram" /><span><strong>Instagram</strong><small>Nosso dia a dia</small></span><i aria-hidden="true" class="mdi mdi-arrow-top-right" />
            </a>
            <a
              v-if="c.contact.mapUrl"
              aria-label="Abrir localização do escritório no mapa"
              class="bio-social-link"
              :href="c.contact.mapUrl"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i aria-hidden="true" class="mdi mdi-map-marker-outline" /><span><strong>Localização</strong><small>Como chegar</small></span><i aria-hidden="true" class="mdi mdi-arrow-top-right" />
            </a>
          </div>
        </nav>

        <section v-if="professionals.length > 0" aria-labelledby="bio-team-title" class="bio-team">
          <div class="bio-section-heading"><h2 id="bio-team-title">{{ settings.teamTitle }}</h2><span>{{ String(professionals.length).padStart(2, '0') }}</span></div>
          <div class="bio-people">
            <article v-for="person in professionals" :key="person.key" class="bio-person">
              <div class="bio-person-heading">
                <div class="bio-person-photo">
                  <img
                    v-if="person.photo && !failedImages.has(person.photo)"
                    alt=""
                    height="68"
                    loading="lazy"
                    :src="person.photo"
                    width="64"
                    @error="imageFailed(person.photo)"
                  >
                  <span v-else aria-hidden="true">{{ initials(person.name) }}</span>
                </div>
                <div class="bio-person-copy">
                  <h3><a v-if="person.profileUrl" :aria-label="`Conhecer ${person.name} — ${person.role}`" :href="person.profileUrl">{{ person.name }}</a><template v-else>{{ person.name }}</template></h3>
                  <p>{{ person.role }}</p>
                  <small v-if="person.registration">{{ person.registration }}</small>
                </div>
              </div>
              <div class="bio-person-actions">
                <a
                  v-if="person.contactUrl"
                  :aria-label="`${person.name} — ${person.role}: ${person.personalContact ? 'WhatsApp pessoal' : 'WhatsApp do escritório'}`"
                  class="bio-person-whatsapp"
                  :href="person.contactUrl"
                  rel="noopener noreferrer"
                  target="_blank"
                ><i aria-hidden="true" class="mdi mdi-whatsapp" />{{ person.personalContact ? 'WhatsApp' : 'WhatsApp do escritório' }}</a>
                <a
                  v-if="person.instagram"
                  :aria-label="`Instagram de ${person.name} — ${person.role}`"
                  :href="person.instagram"
                  rel="noopener noreferrer"
                  target="_blank"
                ><i aria-hidden="true" class="mdi mdi-instagram" /><span>Instagram</span></a>
                <a v-if="person.profileUrl" :aria-label="`Ver perfil de ${person.name} — ${person.role}`" class="bio-person-profile" :href="person.profileUrl">Perfil<i aria-hidden="true" class="mdi mdi-arrow-top-right" /></a>
              </div>
            </article>
          </div>
        </section>

        <GoogleReviewsSection compact />

        <nav v-if="quickLinks.length > 0" aria-labelledby="bio-quick-title" class="bio-quick-links">
          <div class="bio-section-heading"><h2 id="bio-quick-title">Acesso rápido</h2><i aria-hidden="true" class="mdi mdi-arrow-bottom-right" /></div>
          <a
            v-for="link in quickLinks"
            :key="link.href"
            :aria-label="link.external ? `${link.label}` : undefined"
            :href="link.href"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            :target="link.external ? '_blank' : undefined"
          >
            <span class="bio-quick-icon"><i aria-hidden="true" class="mdi" :class="link.icon || 'mdi-link-variant'" /></span>
            <span><strong>{{ link.label }}</strong><small v-if="link.description">{{ link.description }}</small></span>
            <i aria-hidden="true" class="mdi" :class="link.external ? 'mdi-arrow-top-right' : 'mdi-arrow-right'" />
          </a>
        </nav>

        <div v-if="c.contact.phoneRaw || c.contact.email" aria-label="Outros canais de atendimento" class="bio-other-contacts">
          <a v-if="c.contact.phoneRaw" :href="`tel:+${String(c.contact.phoneRaw).replace(/\D/g, '')}`"><i aria-hidden="true" class="mdi mdi-phone-outline" />Ligar para o escritório</a>
          <a v-if="c.contact.email" :href="`mailto:${c.contact.email}`"><i aria-hidden="true" class="mdi mdi-email-outline" />Enviar e-mail</a>
        </div>
      </div>
    </main>

    <footer class="bio-footer"><p>{{ c.brand.officeName }}</p><small>© {{ currentYear }} · Todos os direitos reservados.</small></footer>
    <AccessibilityMenu />
  </div>
</template>

<style scoped>
.bio-page {
  min-height: 100dvh;
  padding: 28px 24px max(92px, env(safe-area-inset-bottom));
  background: radial-gradient(ellipse at 5% 0%, #e7ddcf 0, transparent 48%), var(--color-surface-soft);
  color: var(--color-text);
}
.bio-toolbar {
  width: min(1040px, 100%);
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.bio-back, .bio-share { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; font-size: .78rem; }
.bio-back { color: #5c6467; }
.bio-share { padding: 8px 14px; border: 1px solid #d6cec3; border-radius: 999px; color: var(--color-primary); }
.bio-back i, .bio-share i { font-size: 1.15rem; }
.bio-share:hover { background: #fff; }
.bio-share-status { width: min(1040px, 100%); margin: 0 auto; color: var(--color-primary); font-size: .8rem; }
.bio-share-status:not(:empty) { padding: 0 0 16px; }
.bio-shell {
  width: min(1040px, 100%);
  margin: auto;
  display: grid;
  grid-template-columns: minmax(0, .96fr) minmax(0, 1.04fr);
  align-items: start;
  background: linear-gradient(90deg, var(--color-primary) 48%, var(--color-surface) 48%);
  border: 1px solid #ded7cd;
  border-radius: 24px;
  box-shadow: 0 24px 80px #39291a0d;
  overflow: clip;
}
.bio-identity {
  position: sticky;
  top: 24px;
  padding: 44px 36px 32px;
  background: radial-gradient(ellipse at 100% 0%, #ffffff0c, transparent 65%), var(--color-primary);
  color: #fff;
  border-radius: 0 0 24px 0;
  align-self: start;
}
.bio-logo { width: 112px; height: 112px; margin-bottom: 28px; display: grid; place-items: center; }
.bio-logo img { width: 100%; height: 100%; object-fit: contain; filter: brightness(0) invert(1);}
.bio-logo>span { font: 3.5rem/1 Georgia, serif; color: #e9dcc1; }
.bio-eyebrow { color: #e1cbaa; font-size: .65rem; font-weight: 500; letter-spacing: .17em; text-transform: uppercase; margin-bottom: 12px; }
.bio-brand-copy h1 { font: 400 clamp(1.8rem, 3vw, 2.55rem)/1.18 Georgia, 'Times New Roman', serif; letter-spacing: -.035em; overflow-wrap: anywhere; }
.bio-brand-copy h1::after { content: ''; display: block; width: 42px; height: 2px; background: var(--color-accent); margin: 20px 0; }
.bio-brand-copy h1:focus { outline: none; }
.bio-description { color: #ebdfdf; font-size: .92rem; max-width: 360px; line-height: 1.7; margin: 0; }
.bio-cover { position: relative; margin-top: 32px; border: 1px solid #ffffff26; border-radius: 12px; overflow: hidden; background: #ffffff0a; }
.bio-cover img { width: 100%; height: auto; aspect-ratio: 5 / 3; object-fit: cover; }
.bio-cover::after { content: ''; position: absolute; inset: 45% 0 0; background: linear-gradient(transparent, #19070cc9); pointer-events: none; }
.bio-cover-caption { position: absolute; z-index: 1; bottom: 12px; left: 14px; right: 14px; color: #fff; display: flex; align-items: center; gap: 6px; font-size: .73rem; }
.bio-cover-caption i { font-size: 1rem; }
.bio-office-info { padding-top: 28px; }
.bio-info-title { display: flex; align-items: center; gap: 8px; font-size: .78rem; font-weight: 500; color: #e1cbaa; margin-bottom: 6px; }
.bio-office-info>p:not(.bio-info-title) { color: #ebdfdf; font-size: .78rem; margin-bottom: 6px; }
.bio-office-info .bio-address { opacity: .9; line-height: 1.6; }
.bio-signature { display: flex; align-items: center; gap: 10px; color: #d7c1b9; font-size: .61rem; letter-spacing: .04em; padding-top: 28px; }
.bio-signature>span { width: 22px; height: 1px; background: var(--color-accent); flex-shrink: 0; }
.bio-content { padding: 32px; min-width: 0; }
.bio-primary-link { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 12px; background: var(--color-primary); color: #fff; box-shadow: 0 8px 20px #3d081015; transition: background .2s, transform .2s; }
.bio-primary-link:hover { color: #fff; background: var(--color-primary-dark); transform: translateY(-2px); }
.bio-primary-icon { width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid #ffffff40; border-radius: 50%; font-size: 1.65rem; flex-shrink: 0; }
.bio-primary-link>span:nth-child(2) { flex: 1; min-width: 0; }
.bio-primary-link strong { display: block; font-size: .95rem; font-weight: 500; }
.bio-primary-link small { display: block; color: #eadbdc; font-size: .73rem; margin-top: 2px; }
.bio-primary-link>i { font-size: 1.35rem; }
.bio-social-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr)); gap: 12px; margin-top: 12px; }
.bio-social-link { display: flex; align-items: center; gap: 9px; padding: 14px 12px; min-height: 72px; border: 1px solid #e6e1da; border-radius: 12px; transition: border-color .2s, background .2s; }
.bio-social-link:hover { border-color: var(--color-accent); background: var(--color-surface-soft); }
.bio-social-link>i:first-child { font-size: 1.5rem; color: var(--color-primary); }
.bio-social-link>span { flex: 1; min-width: 0; }
.bio-social-link strong { display: block; font-size: .78rem; font-weight: 500; }
.bio-social-link small { display: block; font-size: .65rem; color: #65676b; }
.bio-social-link>i:last-child { font-size: .9rem; color: #74716c; }
.bio-team, .bio-quick-links { margin-top: 28px; }
.bio-section-heading { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; }
.bio-section-heading h2 { font-size: .93rem; font-weight: 500; letter-spacing: 0; }
.bio-section-heading>span { color: #827568; font-size: .65rem; letter-spacing: .08em; border: 1px solid #e6e1da; padding: 2px 7px; border-radius: 4px; }
.bio-section-heading>i { color: var(--color-primary); font-size: 1.05rem; }
.bio-people { display: grid; gap: 10px; }
.bio-person { border: 1px solid #e6e1da; border-radius: 12px; overflow: hidden; background: #fff; transition: border-color .2s, box-shadow .2s; }
.bio-person:hover { border-color: #c6b393; box-shadow: 0 6px 18px #39291a08; }
.bio-person-heading { display: flex; align-items: center; gap: 14px; padding: 12px 14px; }
.bio-person-photo { width: 56px; height: 60px; flex-shrink: 0; background: #f1ebe2; border-radius: 7px; overflow: hidden; display: grid; place-items: center; color: var(--color-primary); font: 1.35rem Georgia, serif; }
.bio-person-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.bio-person-copy { min-width: 0; overflow-wrap: anywhere; }
.bio-person h3 { font: 400 1.08rem/1.3 Georgia, serif; margin-bottom: 4px; }
.bio-person-copy p { font-size: .68rem; color: #665e5c; line-height: 1.5; margin: 0; }
.bio-person-copy small { display: block; font-size: .64rem; color: #665e5c; }
.bio-person-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 12px; padding: 0 12px; border-top: 1px solid #efebe5; }
.bio-person-actions a { display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-height: 44px; font-size: .67rem; }
.bio-person-actions i { font-size: 1rem; }
.bio-person-actions .bio-person-whatsapp { color: #22613d; }
.bio-person-actions .bio-person-profile { margin-left: auto; color: var(--color-primary); }
.bio-quick-links>a { display: flex; align-items: center; gap: 12px; border-top: 1px solid #e9e4dc; padding: 13px 0; min-height: 66px; }
.bio-quick-icon { display: grid; place-items: center; width: 36px; height: 36px; flex-shrink: 0; background: #f5f0e9; color: var(--color-primary); border-radius: 9px; font-size: 1.18rem; }
.bio-quick-links>a>span:nth-child(2) { flex: 1; min-width: 0; }
.bio-quick-links strong { display: block; font-size: .79rem; font-weight: 500; }
.bio-quick-links small { display: block; color: #65676b; font-size: .67rem; }
.bio-quick-links>a>i { color: var(--color-primary); transition: transform .2s; }
.bio-quick-links>a:hover>i { transform: translateX(3px); }
.bio-other-contacts { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0 16px; margin-top: 14px; padding-top: 8px; border-top: 1px solid #e9e4dc; }
.bio-other-contacts a { display: flex; align-items: center; gap: 6px; font-size: .67rem; min-height: 44px; color: #5a6065; }
.bio-other-contacts i { color: var(--color-primary); font-size: 1rem; }
.bio-footer { background: none; color: #65676b; text-align: center; padding: 24px 0 0; }
.bio-footer p { font-size: .72rem; margin: 0 0 3px; }
.bio-footer small { font-size: .64rem; }
.bio-content a, .bio-footer p, .bio-other-contacts a { overflow-wrap: anywhere; }

@media (max-width: 800px) {
  .bio-page { padding: 16px 16px 88px; }
  .bio-toolbar { width: min(520px, 100%); margin-bottom: 12px; }
  .bio-share-status { width: min(520px, 100%); }
  .bio-shell { width: min(520px, 100%); grid-template-columns: 1fr; border-radius: 20px; background: var(--color-surface); }
  .bio-identity { position: static; padding: 26px 24px 22px; border-radius: 0; }
  .bio-brand-block { display: flex; align-items: center; gap: 18px; }
  .bio-logo { width: 82px; height: 82px; margin: 0; flex: 0 0 82px; }
  .bio-logo>span { font-size: 2.5rem; }
  .bio-brand-copy { min-width: 0; }
  .bio-eyebrow { font-size: .52rem; letter-spacing: .13em; margin-bottom: 7px; }
  .bio-brand-copy h1 { font-size: 1.75rem; }
  .bio-brand-copy h1::after { display: none; }
  .bio-description { font-size: .72rem; line-height: 1.6; margin-top: 8px; }
  .bio-cover { margin-top: 22px; }
  .bio-cover img { aspect-ratio: 2.5 / 1; object-position: center 36%; }
  .bio-office-info { padding-top: 18px; }
  .bio-info-title { font-size: .7rem; }
  .bio-office-info>p:not(.bio-info-title) { font-size: .68rem; }
  .bio-signature { display: none; }
  .bio-content { padding: 22px 20px; }
  .bio-person-actions { gap: 2px 10px; }
}
@media (max-width: 380px) {
  .bio-page { padding-inline: 10px; }
  .bio-share { padding-inline: 12px; }
  .bio-share span { display: none; }
  .bio-identity { padding-inline: 20px; }
  .bio-brand-block { gap: 12px; }
  .bio-logo { width: 64px; height: 64px; flex-basis: 64px; }
  .bio-brand-copy h1 { font-size: 1.55rem; }
  .bio-content { padding-inline: 16px; }
  .bio-primary-link { gap: 10px; padding: 14px; }
  .bio-primary-link strong { font-size: .85rem; }
  .bio-social-grid { gap: 8px; }
  .bio-social-link { gap: 6px; padding-inline: 10px; }
  .bio-social-link>i:last-child { display: none; }
  .bio-person-heading { gap: 10px; padding-inline: 12px; }
  .bio-section-heading h2 { font-size: .85rem; }
}
@media (prefers-reduced-motion: no-preference) {
  .bio-shell { animation: bio-arrive .4s ease-out; }
  @keyframes bio-arrive { from { transform: translateY(8px); } to { transform: translateY(0); } }
}
:global(.accessible-contrast .bio-page),
:global(.accessible-contrast .bio-shell),
:global(.accessible-contrast .bio-person),
:global(.accessible-contrast .bio-person-photo),
:global(.accessible-contrast .bio-quick-icon),
:global(.accessible-contrast .bio-primary-link),
:global(.accessible-contrast .bio-identity) { background: #000 !important; color: #fff !important; }
:global(.accessible-contrast .bio-shell),
:global(.accessible-contrast .bio-person),
:global(.accessible-contrast .bio-person-actions),
:global(.accessible-contrast .bio-social-link),
:global(.accessible-contrast .bio-primary-link),
:global(.accessible-contrast .bio-share),
:global(.accessible-contrast .bio-quick-links>a),
:global(.accessible-contrast .bio-other-contacts) { border-color: #fff !important; }
:global(.accessible-contrast .bio-content i),
:global(.accessible-contrast .bio-toolbar i) { color: #ffeb3b !important; }
:global(.accessible-readable .bio-description),
:global(.accessible-readable .bio-person-copy p) { line-height: 2; letter-spacing: .035em; }
</style>
