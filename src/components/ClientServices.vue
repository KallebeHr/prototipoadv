<script setup>
import { computed, ref, watch } from 'vue'
import { siteConfig as c } from '../config/siteConfig'

const query = ref('')
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const results = computed(() => c.faq.filter(item => normalize(`${item.question} ${item.answer}`).includes(normalize(query.value.trim()))))
const area = ref('')
const checked = ref([])
const checklist = computed(() => c.documentChecklists?.find(item => item.area === area.value && item.approved && item.reviewedBy && item.reviewedAt))
watch(area, () => { checked.value = [] })
const form = ref({ name: '', phone: '', existing: '', subject: '', message: '', mode: '', date: '', period: '', wantsAppointment: false })
const consent = ref(false)
const prepared = ref('')
const status = ref('')
const bookingUrl = computed(() => /^https:\/\//i.test(c.booking?.url || '') ? c.booking.url : '')
const today = () => new Date().toLocaleDateString('sv-SE')
watch(form, () => { prepared.value = ''; status.value = '' }, { deep: true })
watch(consent, () => { prepared.value = ''; status.value = '' })

function prepareContact() {
  if (!consent.value) return
  if (form.value.phone.replace(/\D/g, '').length < 10) {
    status.value = 'Informe um telefone com DDD.'
    return
  }
  if (form.value.wantsAppointment && form.value.date < today()) {
    status.value = 'Escolha uma data a partir de hoje.'
    return
  }
  const f = form.value
  const lines = ['Olá! Gostaria de atendimento.', `Nome: ${f.name}`, `Telefone: ${f.phone}`, `Já sou cliente: ${f.existing}`, `Área: ${f.subject}`, `Motivo: ${f.message}`]
  if (f.wantsAppointment) lines.push('', 'SOLICITAÇÃO DE AGENDAMENTO — aguardo confirmação', `Formato: ${f.mode}`, `Data preferida: ${f.date.split('-').reverse().join('/')}`, `Período preferido: ${f.period}`)
  prepared.value = `https://wa.me/${c.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(lines.join('\n'))}`
  status.value = 'Mensagem preparada. Confira os dados e abra o WhatsApp para enviá-la.'
}

function downloadChecklist() {
  if (!checklist.value) return
  const list = checklist.value
  const content = [c.brand.officeName, `Documentos — ${list.area}`, `Revisão: ${list.reviewedBy} (${list.reviewedAt})`, '', ...list.items.map((item, i) => `${checked.value.includes(i) ? '[x]' : '[ ]'} ${item}`), '', 'Confirme com o escritório quais documentos se aplicam ao seu atendimento.'].join('\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'checklist-documentos.txt'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>

<template>
  <section id="documentos" class="content-section client-services" aria-labelledby="documents-title">
    <p class="eyebrow">PREPARE SEU ATENDIMENTO</p>
    <h2 id="documents-title">Quais documentos separar?</h2>
    <div class="service-panel">
      <label for="document-area">Selecione a área jurídica</label>
      <select id="document-area" v-model="area">
        <option value="">Selecione uma área</option>
        <option v-for="item in c.practiceAreas" :key="item.title">{{ item.title }}</option>
      </select>
      <template v-if="checklist">
        <p class="service-note">Lista revisada por {{ checklist.reviewedBy }} em {{ checklist.reviewedAt }}. Separe apenas os documentos que se aplicam ao seu caso.</p>
        <div class="document-list">
          <label v-for="(item, index) in checklist.items" :key="index"><input v-model="checked" type="checkbox" :value="index">{{ item }}</label>
        </div>
        <p role="status">{{ checked.length }} de {{ checklist.items.length }} itens separados.</p>
        <button type="button" class="service-button" @click="downloadChecklist"><i class="mdi mdi-download" aria-hidden="true" /> Baixar minha lista</button>
      </template>
      <p v-else class="service-note">{{ area ? 'A lista desta área ainda não foi publicada pelo escritório. Solicite orientação no primeiro contato.' : 'Escolha a área para consultar a lista disponibilizada pelo escritório.' }}</p>
    </div>
  </section>

  <section id="duvidas" class="content-section client-services" aria-labelledby="faq-title">
    <p class="eyebrow">DÚVIDAS FREQUENTES</p>
    <h2 id="faq-title">Encontre uma orientação inicial</h2>
    <label for="faq-search">Pesquisar perguntas e respostas</label>
    <div class="faq-search"><input id="faq-search" v-model="query" type="search" placeholder="Ex.: documentos, online, atendimento"><button v-if="query" type="button" @click="query = ''">Limpar</button></div>
    <p class="service-note" role="status">{{ results.length }} pergunta(s) encontrada(s).</p>
    <details v-for="item in results" :key="item.question" class="faq-item"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details>
    <p v-if="!results.length">Não encontrou sua dúvida? <a href="#triagem">Converse com a equipe.</a></p>
  </section>

  <!-- <section id="agendamento" class="content-section client-services" aria-labelledby="booking-title">
    <p class="eyebrow">ATENDIMENTO</p>
    <h2 id="booking-title">Organize sua conversa com o escritório</h2>
    <div v-if="bookingUrl" class="service-panel">
      <p>Consulte os horários disponíveis e conclua o agendamento na agenda do escritório.</p>
      <a class="service-button" :href="bookingUrl" target="_blank" rel="noopener noreferrer">Ver horários na agenda <i class="mdi mdi-open-in-new" aria-hidden="true" /></a>
      <p class="service-note">A confirmação e os lembretes seguem as opções apresentadas pela agenda. Abre em nova aba.</p>
    </div>
    <p v-else>Informe abaixo sua preferência de data e formato. A equipe verificará a disponibilidade e responderá pelo contato informado. A solicitação não reserva um horário.</p>

    <form id="triagem" class="service-panel intake-form" @submit.prevent="prepareContact">
      <h3>Vamos entender seu atendimento</h3>
      <fieldset>
        <legend>1. Sobre o assunto</legend>
        <div class="service-grid">
          <div><label for="intake-client">Já é cliente do escritório?</label><select id="intake-client" v-model="form.existing" required><option value="" disabled>Selecione</option><option>Sim</option><option>Não</option></select></div>
          <div><label for="intake-area">Área jurídica</label><select id="intake-area" v-model="form.subject" required><option value="" disabled>Selecione</option><option v-for="item in c.practiceAreas" :key="item.title">{{ item.title }}</option><option>Não sei / outro assunto</option></select></div>
        </div>
        <label for="intake-message">Descreva brevemente o motivo do contato</label>
        <textarea id="intake-message" v-model.trim="form.message" rows="4" maxlength="1500" required aria-describedby="intake-help" />
        <p id="intake-help" class="service-note">Não inclua senhas, documentos ou detalhes sensíveis nesta mensagem inicial.</p>
      </fieldset>
      <fieldset>
        <legend>2. Preferência de atendimento</legend>
        <label class="check-row"><input v-model="form.wantsAppointment" type="checkbox"> Quero solicitar uma data de atendimento</label>
        <div v-if="form.wantsAppointment" class="appointment-fields">
          <div class="service-grid">
            <div><label for="intake-mode">Formato</label><select id="intake-mode" v-model="form.mode" required><option value="" disabled>Selecione</option><option v-for="mode in c.booking.modes" :key="mode">{{ mode }}</option></select></div>
            <div><label for="intake-date">Data preferida</label><input id="intake-date" v-model="form.date" type="date" :min="today()" required></div>
            <div><label for="intake-period">Período preferido</label><select id="intake-period" v-model="form.period" required><option value="" disabled>Selecione</option><option>Manhã</option><option>Tarde</option><option>A combinar</option></select></div>
          </div>
          <p class="service-note">Preferência sujeita à disponibilidade e confirmação do escritório. Nenhum horário será reservado por este formulário.</p>
        </div>
      </fieldset>
      <fieldset>
        <legend>3. Seus contatos</legend>
        <div class="service-grid">
          <div><label for="intake-name">Nome completo</label><input id="intake-name" v-model.trim="form.name" autocomplete="name" maxlength="120" required></div>
          <div><label for="intake-phone">Telefone com DDD</label><input id="intake-phone" v-model.trim="form.phone" type="tel" autocomplete="tel" maxlength="25" required></div>
        </div>
      </fieldset>
      <label class="check-row"><input v-model="consent" type="checkbox" required> Autorizo o uso destas informações para retorno deste atendimento.</label>
      <button type="submit" class="service-button">Preparar mensagem <i class="mdi mdi-arrow-right" aria-hidden="true" /></button>
      <p role="status" class="service-note">{{ status }}</p>
      <a v-if="prepared" :href="prepared" target="_blank" rel="noopener noreferrer" class="service-button"><i class="mdi mdi-whatsapp" aria-hidden="true" /> Abrir WhatsApp para enviar (nova aba)</a>
    </form>
  </section> -->
</template>

<style scoped>
.client-services{max-width:100%;overflow-wrap:anywhere}.client-services label{display:block;font-weight:500;font-size:.9rem;margin-bottom:8px}.client-services input:not([type=checkbox]),.client-services select,.client-services textarea{font:inherit;color:inherit;background:var(--color-surface);border:1px solid #aab3b9;border-radius:4px;min-height:46px;padding:11px 13px;width:100%;min-width:0}.client-services textarea{resize:vertical}.service-panel{border:1px solid #dce0e2;border-radius:6px;padding:clamp(18px,3vw,32px);background:var(--color-surface-soft)}.service-note{font-size:.88rem;margin:14px 0;line-height:1.6}.service-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin-bottom:20px}.service-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:46px;padding:12px 20px;background:var(--color-primary);color:white;border-radius:4px;white-space:normal;text-align:center}.service-button:hover{background:var(--color-primary-dark);color:white}.intake-form{margin-top:28px;max-width:900px}.intake-form h3{margin-bottom:24px}.intake-form fieldset{min-width:0;border:0;border-top:1px solid #dce0e2;padding:22px 0 12px;margin:0}.intake-form legend{font-weight:700;padding-right:16px}.check-row,.document-list label{display:flex!important;align-items:flex-start;gap:12px;line-height:1.6;font-weight:400!important}.check-row input,.document-list input{flex:0 0 auto;width:20px;height:20px;margin-top:3px;accent-color:var(--color-primary)}.document-list{display:grid;gap:16px;margin:24px 0}.faq-search{display:flex;gap:12px;max-width:700px}.faq-search button{min-width:60px}.faq-item{padding:20px 0;border-bottom:1px solid #dce0e2}.faq-item summary{cursor:pointer;font-weight:500}.faq-item p{margin:16px 0 0}.appointment-fields{margin-top:22px}:global(.accessible-contrast) .service-panel,:global(.accessible-contrast) .client-services input,:global(.accessible-contrast) .client-services textarea,:global(.accessible-contrast) .client-services select{background:#000;color:#fff;border-color:#fff}@media(max-width:600px){.service-grid{grid-template-columns:1fr}.service-button{width:100%}}
</style>
