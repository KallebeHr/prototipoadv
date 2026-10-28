<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { siteConfig as c, whatsappUrl } from '../config/siteConfig'
import AccessibilityMenu from './AccessibilityMenu.vue'
const props = defineProps({ slug: { type: String, required: true } })
const index = computed(() => c.professionalProfiles.findIndex(profile => profile.slug === props.slug))
const person = computed(() => c.team[index.value])
const profile = computed(() => c.professionalProfiles[index.value])
const title = ref(null)
const contactUrl = computed(() => profile.value?.whatsapp ? `https://wa.me/${profile.value.whatsapp.replace(/\D/g, '')}` : whatsappUrl())
onMounted(async () => { await nextTick(); title.value?.focus() })
</script>

<template>
  <main class="professional-page wrap">
    <a class="text-link" href="#equipe">← Voltar para a equipe</a>
    <article v-if="person && profile" class="profile-layout">
      <img :src="person.photo" :alt="person.name" width="480" height="560">
      <div>
        <p class="eyebrow">NOSSA EQUIPE</p>
        <h1 ref="title" tabindex="-1">{{ person.name }}</h1>
        <p class="profile-role">{{ person.role }}</p>
        <p v-if="profile.registration">{{ profile.registration }}</p>
        <p>{{ profile.biography || person.description }}</p>
        <template v-if="profile.education?.length"><h2>Formação</h2><ul><li v-for="item in profile.education" :key="item">{{ item }}</li></ul></template>
        <template v-if="profile.areas?.length"><h2>Áreas de atuação</h2><ul><li v-for="item in profile.areas" :key="item">{{ item }}</li></ul></template>
        <h2>Atendimento</h2>
        <div class="profile-links">
          <a :href="contactUrl" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a :href="`mailto:${profile.email || c.contact.email}`">E-mail</a>
          <a v-if="person.linkedin" :href="person.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a v-if="person.instagram" :href="person.instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </article>
    <div v-else><h1 ref="title" tabindex="-1">Perfil não encontrado</h1><p>Consulte os profissionais na página da equipe.</p></div>
  </main>
  <AccessibilityMenu />
</template>

<style scoped>
.professional-page{padding-block:36px 100px;min-height:100dvh}.profile-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:clamp(24px,5vw,72px);margin-top:32px;overflow-wrap:anywhere}.profile-layout>img{width:100%;height:auto;aspect-ratio:6/7;object-fit:cover;object-position:top}.profile-layout h1{font-size:clamp(1.8rem,4vw,2.5rem);margin-bottom:16px}.profile-layout h2{font-size:1.3rem;margin:28px 0 14px}.profile-role{color:var(--color-primary)}.profile-links{display:flex;gap:16px;flex-wrap:wrap}.profile-links a{padding:10px 0;color:var(--color-primary);text-decoration:underline}@media(max-width:700px){.profile-layout{grid-template-columns:1fr}.profile-layout>img{max-width:400px}}
</style>
