<script setup>
import { siteConfig as c, whatsappUrl } from '../config/siteConfig'
</script>

<template>
  <section id="areas" class="content-section">
    <p class="eyebrow">ATUAÇÃO JURÍDICA</p>
    <h2>Conhecimento a serviço de você</h2>
    <div class="areas-grid">
      <details v-for="(area, index) in c.practiceAreas" :id="`area-${index}`" :key="area.title">
        <summary>{{ area.title }}<i class="mdi mdi-plus" aria-hidden="true" /></summary>
        <p>{{ area.description }}</p><a :href="whatsappUrl()" target="_blank" rel="noopener">Conversar sobre esta área
          <i class="mdi mdi-arrow-top-right" aria-hidden="true" /></a>
      </details>
    </div>
  </section>
  <section class="content-section service-journey" aria-labelledby="journey-title">
    <div>
      <p class="eyebrow">ATENDIMENTO SEM COMPLICAÇÃO</p>
      <h2 id="journey-title">Entenda como funciona</h2>
      <p>Uma jornada simples para você saber o que acontece desde o primeiro contato.</p>
    </div>
    <ol>
      <li v-for="(step, index) in c.serviceJourney" :key="step.title"><span>0{{ index + 1 }}</span><i class="mdi"
          :class="step.icon" aria-hidden="true" />
        <h3>{{ step.title }}</h3>
        <p>{{ step.text }}</p>
      </li>
    </ol>
  </section>
</template>
