<script setup>
  import { computed } from 'vue'
  const props = defineProps({ rating: { type: Number, required: true } })
  const value = computed(() => Math.max(0, Math.min(5, props.rating)))
  const label = computed(() => `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value.value)} de 5 estrelas`)
</script>

<template>
  <span :aria-label="label" class="review-stars" role="img">
    <span aria-hidden="true"><i v-for="star in 5" :key="star" class="mdi mdi-star-outline" /></span>
    <span aria-hidden="true" class="review-stars__fill" :style="{ width: `${value / 5 * 100}%` }"><i v-for="star in 5" :key="star" class="mdi mdi-star" /></span>
  </span>
</template>

<style scoped>
.review-stars { position: relative; display: inline-block; color: #97671a; font-size: 1.2rem; line-height: 1; white-space: nowrap; vertical-align: middle; }
.review-stars>span { display: flex; }
.review-stars i { width: 1em; font-size: inherit; flex: 0 0 1em; }
.review-stars__fill { position: absolute; inset: 0 auto 0 0; overflow: hidden; }
:global(.accessible-contrast .review-stars) { color: #ffeb3b; }
</style>
