<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { siteConfig as c } from '../config/siteConfig'
  import AccessibilityMenu from './AccessibilityMenu.vue'
  const props = defineProps({ kind: { type: String, required: true } })
  const title = ref(null)
  const privacy = computed(() => props.kind === 'privacidade')
  onMounted(() => title.value?.focus({ preventScroll: true }))
</script>

<template>
  <main class="wrap gr-policy">
    <a class="text-link" href="#avaliacoes"><i aria-hidden="true" class="mdi mdi-arrow-left" />Voltar às avaliações</a>
    <p class="eyebrow">{{ c.brand.shortName }}</p>
    <h1 ref="title" tabindex="-1">{{ privacy ? 'Privacidade das avaliações' : 'Termos de uso das avaliações' }}</h1>
    <p class="gr-policy-intro">Informações sobre a seção de avaliações do Google Maps exibida neste site.</p>
    <template v-if="privacy">
      <section><h2>Informações exibidas</h2><p>A seção apresenta informações públicas do perfil do escritório no Google Maps, incluindo nota geral, quantidade de avaliações e, quando disponíveis, nomes, fotos públicas dos autores, datas, notas e comentários. Os dados são consultados no Google e não são gravados em uma base permanente deste site nem no armazenamento local do navegador.</p></section>
      <section><h2>Serviços externos</h2><p>Ao carregar fotografias públicas de autores ou abrir links do Google, seu navegador se conecta aos serviços do Google. Esses serviços podem tratar informações técnicas da conexão conforme suas próprias políticas. A <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Política de Privacidade do Google (nova aba)</a> integra estas informações para o uso desses serviços.</p></section>
      <section><h2>Publicar ou alterar uma avaliação</h2><p>Os botões de avaliação levam ao Google Maps. A publicação, identificação da conta, edição e remoção de avaliações ocorrem no Google, conforme suas regras. Este site não recebe um formulário para publicar avaliações, não solicita a senha da sua conta Google e não envia avaliações em seu nome.</p></section>
    </template>
    <template v-else>
      <section><h2>Origem do conteúdo</h2><p>As notas e opiniões exibidas são fornecidas pelo Google Maps. A nota geral e o total de avaliações vêm do perfil do escritório. A seleção de até cinco comentários segue a relevância definida pelo Google e pode representar apenas parte das opiniões publicadas.</p></section>
      <section><h2>Consulta e atribuição</h2><p>Os autores são identificados com as informações públicas fornecidas pelo Google. Textos extensos podem ser recolhidos, com opção de leitura completa. Quando houver tradução, a seção indica essa condição e oferece acesso ao texto original. Os links disponíveis permitem consultar a fonte ou reportar o conteúdo ao Google.</p></section>
      <section><h2>Condições aplicáveis</h2><p>O uso de conteúdo e serviços do Google Maps observa os <a href="https://maps.google.com/help/terms_maps.html" rel="noopener noreferrer" target="_blank">Termos de Serviço do Google Maps (nova aba)</a>, os <a href="https://cloud.google.com/maps-platform/terms" rel="noopener noreferrer" target="_blank">Termos da Plataforma Google Maps (nova aba)</a> e a <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Política de Privacidade do Google (nova aba)</a>, incorporados a estas condições para essa seção.</p></section>
    </template>
    <section><h2>Contato sobre esta seção</h2><p>Para dúvidas sobre a apresentação das avaliações neste site, entre em contato com {{ c.brand.officeName }}<template v-if="c.contact.email"> pelo e-mail <a :href="`mailto:${c.contact.email}`">{{ c.contact.email }}</a></template>.</p></section>
  </main>
  <AccessibilityMenu />
</template>

<style scoped>
.gr-policy { max-width: 880px; min-height: 100dvh; padding-block: 40px 100px; }
.gr-policy h1 { font: 400 clamp(1.8rem, 4vw, 2.6rem)/1.2 Georgia, serif; margin: 0 0 20px; }
.gr-policy-intro { color: #626a70; margin-bottom: 34px; }
.gr-policy section { margin-top: 28px; }
.gr-policy h2 { font-size: 1.2rem; margin-bottom: 12px; }
.gr-policy p { line-height: 1.9; font-size: .95rem; }
.gr-policy p a { color: var(--color-primary); text-decoration: underline; overflow-wrap: anywhere; }
</style>
