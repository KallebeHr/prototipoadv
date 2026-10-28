<script setup>
  import { computed } from 'vue'
  import { siteConfig as c } from '../config/siteConfig'

  const socialLinks = computed(() => Object.entries(c.social).filter(([, url]) => url))
  const currentYear = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="wrap footer-inner">
      <span>{{ c.brand.officeName }}<small>{{ c.brand.oab }}</small></span>
      <p>© {{ currentYear }} · Todos os direitos reservados.</p>
      <nav aria-label="Links do escritório e redes sociais" class="social-links">
        <a href="#/linkbio">Link na bio</a>
        <a v-if="c.googleReviews?.enabled" href="#avaliacoes">Avaliações</a>
        <a
          v-for="[network, url] in socialLinks"
          :key="network"
          :href="url"
          rel="noopener"
          target="_blank"
        >{{ network }}</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.social-links { flex-wrap: wrap; }
</style>
