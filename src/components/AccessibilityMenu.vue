<script setup>
import { ref, watch, onUnmounted } from 'vue'

const open = ref(false)
const contrast = ref(false)
const underline = ref(false)
const readable = ref(false)
const size = ref(100)
const status = ref('')
const loading = ref(false)
const libras = ref(false)
const speaking = ref(false)
const paused = ref(false)
let widget

watch(open, value => document.documentElement.classList.toggle('libras-panel-open', value))
watch([contrast, underline, readable, size], () => {
  document.documentElement.classList.toggle('accessible-contrast', contrast.value)
  document.documentElement.classList.toggle('accessible-links', underline.value)
  document.documentElement.classList.toggle('accessible-readable', readable.value)
  document.documentElement.style.fontSize = `${size.value}%`
})

function stopReading() {
  window.speechSynthesis?.cancel()
  speaking.value = false
  paused.value = false
}

function reset() {
  contrast.value = false
  underline.value = false
  readable.value = false
  size.value = 100
  stopReading()
}

function readPage() {
  if (!('speechSynthesis' in window)) {
    status.value = 'A leitura em voz alta não é compatível com este navegador.'
    return
  }

  window.speechSynthesis.cancel()
  const text = document.querySelector('main')?.innerText?.replace(/\s+/g, ' ').trim()
  if (!text) return

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'pt-BR'
  utterance.rate = 0.95
  utterance.onstart = () => {
    speaking.value = true
    paused.value = false
    status.value = 'Leitura da página iniciada.'
  }
  utterance.onend = () => {
    speaking.value = false
    paused.value = false
    status.value = 'Leitura concluída.'
  }
  utterance.onerror = () => {
    speaking.value = false
    paused.value = false
    status.value = 'A leitura foi interrompida.'
  }
  window.speechSynthesis.speak(utterance)
}

function togglePause() {
  if (!speaking.value) return
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
    paused.value = false
    status.value = 'Leitura retomada.'
  } else {
    window.speechSynthesis.pause()
    paused.value = true
    status.value = 'Leitura pausada.'
  }
}

async function loadLibras() {
  if (loading.value) return
  loading.value = true
  status.value = 'Carregando o tradutor de Libras…'

  try {
    await new Promise((resolve, reject) => {
      if (window.VLibras) return resolve()
      const script = document.createElement('script')
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
      const timeout = setTimeout(() => reject(new Error('timeout')), 15000)
      script.onload = () => { clearTimeout(timeout); resolve() }
      script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('network')) }
      document.head.appendChild(script)
    })

    if (!widget) widget = new window.VLibras.Widget('https://vlibras.gov.br/app')
    const launcher = await new Promise((resolve, reject) => {
      const start = Date.now()
      const check = () => {
        const button = document.querySelector('#vlibras-access-wrapper')?.shadowRoot?.querySelector('#vlibras-button')
        if (button) return resolve(button)
        if (Date.now() - start > 15000) return reject(new Error('timeout'))
        setTimeout(check, 100)
      }
      check()
    })
    launcher.click()
    libras.value = true
    status.value = ''
    open.value = false
  } catch {
    status.value = 'Não foi possível carregar o VLibras. Verifique sua conexão e tente novamente.'
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  reset()
  widget?.destroy?.()
})
</script>

<template>
  <Teleport to="body">
  <div class="accessibility-widget" @keydown.esc="open = false">
    <section v-show="open" id="accessibility-panel" aria-label="Opções de acessibilidade" class="accessibility-panel">
      <header>
        <h2>Acessibilidade</h2>
        <button aria-label="Fechar acessibilidade" @click="open = false"><i class="mdi mdi-close" aria-hidden="true" /></button>
      </header>
      <p>Personalize sua navegação e leitura</p>
      <div class="size-controls">
        <button aria-label="Diminuir texto" :disabled="size <= 100" @click="size -= 10">A−</button>
        <output aria-live="polite">{{ size }}%</output>
        <button aria-label="Aumentar texto" :disabled="size >= 150" @click="size += 10">A+</button>
      </div>
      <label><input v-model="contrast" type="checkbox"> Alto contraste</label>
      <label><input v-model="underline" type="checkbox"> Destacar links</label>
      <label><input v-model="readable" type="checkbox"> Espaçamento de leitura</label>
      <div class="speech-tools" aria-label="Leitura em voz alta">
        <strong><i class="mdi mdi-account-voice" aria-hidden="true" /> Leitura em voz alta</strong>
        <button v-if="!speaking" class="access-action" @click="readPage"><i class="mdi mdi-play" aria-hidden="true" /> Ler conteúdo principal</button>
        <template v-else>
          <button class="access-action" @click="togglePause"><i class="mdi" :class="paused ? 'mdi-play' : 'mdi-pause'" aria-hidden="true" /> {{ paused ? 'Continuar leitura' : 'Pausar leitura' }}</button>
          <button class="access-action" @click="stopReading"><i class="mdi mdi-stop" aria-hidden="true" /> Parar leitura</button>
        </template>
      </div>
      <button class="access-action" @click="reset"><i class="mdi mdi-restore" aria-hidden="true" /> Restaurar padrão</button>
      <button class="access-action" :disabled="loading" @click="loadLibras"><i class="mdi mdi-hand-wave-outline" aria-hidden="true" /> {{ loading ? 'Carregando…' : (libras ? 'Abrir tradução em Libras' : 'Ativar tradução em Libras') }}</button>
      <p class="libras-status" role="status" aria-live="polite">{{ status }}</p>
      <div v-show="libras" vw class="libras-container enabled"><div vw-access-button class="active" /><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper" /></div></div>
    </section>
    <button class="accessibility-button" aria-controls="accessibility-panel" :aria-expanded="open" aria-label="Opções de acessibilidade" @click="open = !open"><i class="mdi mdi-human" aria-hidden="true" /></button>
  </div>
  </Teleport>
</template>

<style scoped>
.accessibility-widget {
  position: fixed;
  left: max(20px, env(safe-area-inset-left));
  bottom: max(20px, env(safe-area-inset-bottom));
  z-index: 5000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  font-family: inherit;
}

.accessibility-button {
  width: 52px;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  background: linear-gradient(155deg, var(--color-secondary, #102f42), color-mix(in srgb, var(--color-secondary, #102f42) 78%, #000));
  color: #fff;
  font-size: 1.3rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow:
    0 12px 26px -6px rgba(16, 47, 66, 0.38),
    0 3px 8px rgba(16, 47, 66, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease, background 0.3s ease;
}

.accessibility-button:hover {
  background: linear-gradient(155deg, var(--color-primary, #1c5d7a), color-mix(in srgb, var(--color-primary, #1c5d7a) 78%, #000));
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 16px 32px -6px rgba(16, 47, 66, 0.42),
    0 4px 10px rgba(16, 47, 66, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.accessibility-button:active {
  transform: translateY(0) scale(0.97);
}

.accessibility-button:focus-visible {
  outline: 2px solid var(--color-primary, #1c5d7a);
  outline-offset: 3px;
}

.accessibility-panel {
  width: min(360px, calc(100vw - 36px));
  max-height: min(600px, calc(100vh - 120px));
  overflow-y: auto;
  padding: 22px 22px 18px;
  border: 1px solid rgba(222, 224, 222, 0.7);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  color: #25343d;
  box-shadow:
    0 28px 64px -14px rgba(16, 47, 66, 0.26),
    0 10px 28px -10px rgba(16, 47, 66, 0.16),
    0 0 0 1px rgba(255, 255, 255, 0.4) inset;
  animation: panel-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.accessibility-panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
}

.accessibility-panel h2 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: #1a262d;
}

.accessibility-panel header button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #52616a;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.accessibility-panel header button:hover {
  background: #f2f1ee;
  color: #1a262d;
}

.accessibility-panel > p:first-of-type {
  margin: 2px 0 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #ececea;
  font-size: 0.78rem;
  color: #7a848a;
  letter-spacing: 0.01em;
}

.size-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
}

.size-controls::before {
  content: 'Tamanho do texto';
  font-size: 0.82rem;
  font-weight: 600;
  color: #34444d;
}

.size-controls {
  padding: 2px 0;
}

.size-controls output {
  min-width: 50px;
  text-align: center;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: #566068;
  border-left: 1px solid #e0e1df;
  border-right: 1px solid #e0e1df;
  padding: 0 6px;
}

.size-controls {
  border: 1px solid #e0e1df;
  border-radius: 10px;
  background: #faf9f7;
  padding-left: 12px;
}

.size-controls button {
  width: 36px;
  height: 34px;
  border: 0;
  background: transparent;
  color: var(--color-secondary, #102f42);
  font-weight: 700;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease;
}

.size-controls button:hover:not(:disabled) {
  background: var(--color-secondary, #102f42);
  color: #fff;
}

.size-controls button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.accessibility-panel label {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 6px 0 2px;
  font-size: 0.83rem;
  font-weight: 500;
  color: #34444d;
  cursor: pointer;
  border-top: 1px solid #f0efec;
  border-radius: 6px;
  transition: background 0.2s ease, padding-left 0.2s ease;
}

.accessibility-panel label:hover {
  background: #f7f6f3;
  padding-left: 10px;
}

.accessibility-panel label input[type='checkbox'] {
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  width: 32px;
  height: 18px;
  margin: 0;
  border-radius: 20px;
  background: #cdd1d3;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.accessibility-panel label input[type='checkbox']::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.accessibility-panel label input[type='checkbox']:checked {
  background: var(--color-primary, #1c5d7a);
}

.accessibility-panel label input[type='checkbox']:checked::after {
  transform: translateX(14px);
}

.accessibility-panel label input[type='checkbox']:focus-visible {
  outline: 2px solid var(--color-primary, #1c5d7a);
  outline-offset: 3px;
}

.speech-tools {
  margin-top: 14px;
  padding: 14px 14px 12px;
  border-radius: 12px;
  background: #faf9f7;
  border: 1px solid #f0efec;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.speech-tools strong {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-secondary, #102f42);
}

.access-action {
  width: 100%;
  min-height: 42px;
  border: 0;
  border-radius: 9px;
  background: linear-gradient(155deg, var(--color-secondary, #102f42), color-mix(in srgb, var(--color-secondary, #102f42) 80%, #000));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.81rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: 0 6px 16px -5px rgba(16, 47, 66, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease, opacity 0.2s ease;
}

.access-action:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px -5px rgba(16, 47, 66, 0.4);
}

.access-action:active:not(:disabled) {
  transform: translateY(0);
}

.access-action:disabled {
  opacity: 0.6;
  cursor: progress;
}

.access-action:focus-visible {
  outline: 2px solid var(--color-primary, #1c5d7a);
  outline-offset: 3px;
}

.accessibility-panel > .access-action {
  margin-top: 14px;
}

.accessibility-panel > .access-action + .access-action {
  margin-top: 10px;
}

.libras-status {
  min-height: 0;
  margin: 10px 0 0;
  color: #8a939a;
  font-size: 0.68rem;
  text-align: center;
  letter-spacing: 0.01em;
}

.libras-status:empty {
  margin: 0;
}

@media (max-width: 420px) {
  .accessibility-widget {
    left: max(14px, env(safe-area-inset-left));
    bottom: max(14px, env(safe-area-inset-bottom));
  }

  .accessibility-panel {
    width: calc(100vw - 28px);
  }
}
</style>