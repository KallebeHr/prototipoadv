<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { siteConfig as c } from '../config/siteConfig'

const mapElement = ref(null)
let map

onMounted(() => {
  const point = [c.contact.latitude, c.contact.longitude]
  map = L.map(mapElement.value, { scrollWheelZoom: false, zoomControl: true }).setView(point, c.contact.mapZoom)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
  }).addTo(map)
  L.circleMarker(point, { radius: 10, color: c.theme.primary, weight: 4, fillColor: '#fff', fillOpacity: 1 })
    .addTo(map)
    .bindPopup(`<strong>${c.brand.officeName}</strong><br>${c.contact.address}`)
    .openPopup()
})

onUnmounted(() => map?.remove())
</script>

<template>
  <section id="localizacao" class="location-section content-section" aria-labelledby="location-title">
    <div class="location-copy">
      <p class="eyebrow">COMO CHEGAR</p>
      <h2 id="location-title">Encontre nosso escritório com facilidade</h2>
      <p>Use o mapa para reconhecer a região. Para traçar a rota desde sua localização, abra o aplicativo de mapas no botão abaixo.</p>
      <ol class="route-steps">
        <li><i class="mdi mdi-map-marker-outline" aria-hidden="true" /><span><strong>Confira o destino</strong>{{ c.contact.address }}, {{ c.contact.city }}</span></li>
        <li><i class="mdi mdi-map-search-outline" aria-hidden="true" /><span><strong>Abra sua rota</strong>O mapa do seu aparelho calculará o melhor caminho.</span></li>
        <li><i class="mdi mdi-clock-outline" aria-hidden="true" /><span><strong>Planeje sua visita</strong>{{ c.contact.businessHours }}</span></li>
      </ol>
      <a class="solid-button" :href="c.contact.mapUrl" target="_blank" rel="noopener"><i class="mdi mdi-directions" aria-hidden="true" /> Traçar rota no mapa</a>
    </div>
    <div class="map-shell">
      <div ref="mapElement" class="office-map" role="application" :aria-label="`Mapa indicando ${c.contact.address}, ${c.contact.city}`" />
      <p><i class="mdi mdi-information-outline" aria-hidden="true" /> O mapa pode ser movimentado com as setas após receber foco. Use + e − para ampliar.</p>
    </div>
  </section>
</template>
