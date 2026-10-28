<script setup>
import { computed } from 'vue'
import { siteConfig as c, whatsappUrl } from '../config/siteConfig'
import OfficeMap from './OfficeMap.vue'
import ClientServices from './ClientServices.vue'
const socialLinks = computed(() => Object.entries(c.social).filter(([, url]) => url))
</script>

<template>
  <OfficeMap />
  <ClientServices />
  <section id="contato" class="content-section contact-area" aria-labelledby="contact-title">
    <div class="contact-intro">
      <p class="eyebrow">VAMOS CONVERSAR</p>
      <h2 id="contact-title">Seu próximo passo começa com uma conversa.</h2>
      <p>Escolha um canal de atendimento ou <a href="#triagem" class="text-link">prepare seu primeiro contato</a>.</p>
      <div class="contact-channels">
        <a :href="whatsappUrl()" target="_blank" rel="noopener"><i class="mdi mdi-whatsapp" aria-hidden="true" /><span><strong>WhatsApp</strong>{{ c.contact.phone }}</span></a>
        <a :href="`mailto:${c.contact.email}`"><i class="mdi mdi-email-outline" aria-hidden="true" /><span><strong>E-mail</strong>{{ c.contact.email }}</span></a>
      </div>
     <nav class="contact-socials" aria-label="Redes sociais do escritório">
  <a
    v-for="[network, url] in socialLinks"
    :key="network"
    :href="url"
    :class="{ 'instagram-link': network === 'instagram' }"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="`${network}`"
  >
    <i
      class="mdi"
      :class="`mdi-${network}`"
      aria-hidden="true"
    />

    <span v-if="network === 'instagram'">
      @{{ url.split('instagram.com/')[1]?.split(/[/?#]/)[0] }}
    </span>
  </a>
</nav>
    </div>
    <div><h3>Prepare seu atendimento</h3><p>{{ c.contact.businessHours }}</p><a class="text-link" href="#documentos">Consultar documentos <i class="mdi mdi-arrow-right" aria-hidden="true" /></a><br></div>
  </section>
</template>
<style scoped>
.contact-socials {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.contact-socials a.instagram-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: auto;
  max-width: 100%;
  height: auto;
  min-height: 46px;
  padding: 10px 16px;
  border-radius: 8px;
}

.contact-socials .instagram-link span {
  display: inline;
  min-width: 0;
  font-size: 14px;
  overflow-wrap: anywhere;
}
</style>