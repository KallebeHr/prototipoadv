import { reactive } from 'vue'
export const siteConfig = reactive({
  brand: {
    officeName: 'Leite Holanda & Carvalho',
    shortName: 'Leite Holanda & Carvalho',
    professionalName: 'Leite Holanda & Carvalho',
    oab: 'OAB/MA 29.564-A',
    logo: '/Logo.png',
    initials: 'RB',
    favicon: '/favicon.ico',
    developer: 'Max Sistemas',
  },

  theme: {
 primary: '#041E2D',      // Verde-floresta institucional
  primaryDark: '#10271f',  // Verde profundo, elegante
  secondary: '#5a7a68',    // Verde-sálvia (identidade Agro)
  accent: '#b79a65',       // Dourado sofisticado
  surface: '#ffffff',      // Branco
  surfaceSoft: '#f5f6f1',  // Off-white com toque natural
  text: '#213d32',         // Verde-escuro para textos
  },

  
hero: {
  eyebrow: 'Ramon Bastos | Advocacia Agro',
  title: 'Atuação em Direito Previdenciário, Bancário, Cível, Imobiliário, Trabalhista e Público.',
  highlight: 'no campo',
  subtitle: 'Atuação estratégica na defesa do produtor rural, com soluções jurídicas para dívidas rurais, contratos, execuções e regularização de imóveis.',
  video: '/IMG-VIDEOS/Teste.mp4',
  backgroundImage: '/media/Banner3.png',
  ctaLabel: 'Fale com o advogado',
  highlights: ['Segurança jurídica', 'Compromisso com o agro', 'Defesa estratégica'],
},

contact: {
  phone: '(89) 99429-1864',
  phoneRaw: '5589994291864',
  whatsapp: '5589994291864',
whatsappMessage: 'Olá! Vim pelo site e gostaria de receber orientação jurídica sobre uma questão nas áreas de atuação do escritório.',  email: 'leiteholandacarvalho@gmail.com',
  address: 'Picos e Itainópolis/P',
  city: 'Picos e Itainópolis/PI',
  zipCode: '58000-000',
  businessHours: 'Segunda a sexta, das 8h às 18h',
  emergencyPhone: '(89) 99429-1864',
  mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Jo%C3%A3o%20Pessoa%2C%20PB',
  latitude: -7.1195,
  longitude: -34.8450,
  mapZoom: 11,
},

booking: {
  url: 'https://calendar.app.google/AKAQmEPSnxWeeRo7A',
  modes: ['Presencial', 'Por vídeo'],
},

documentChecklists: [
  {
    area: 'Prorrogação de Dívidas Rurais',
    approved: false,
    reviewedBy: '',
    reviewedAt: '',
    items: [
      'Documento de identificação do produtor rural',
      'Cédulas de crédito rural, contratos e aditivos',
      'Comprovantes de perdas, dificuldades financeiras ou eventos que comprometeram a produção',
    ],
  },
  {
    area: 'Execuções de Dívidas Rurais',
    approved: false,
    reviewedBy: '',
    reviewedAt: '',
    items: [
      'Documento de identificação',
      'Citação judicial, intimações ou documentos da execução',
      'Contratos de financiamento, demonstrativos de dívida e comprovantes de pagamento',
    ],
  },
  {
    area: 'Contratos Rurais',
    approved: false,
    reviewedBy: '',
    reviewedAt: '',
    items: [
      'Documento de identificação das partes',
      'Contrato de arrendamento, parceria, compra e venda ou outro instrumento rural',
      'Documentos da propriedade e comprovantes relacionados ao contrato',
    ],
  },
{
  area: 'Regularização Imobiliária',
  approved: false,
  reviewedBy: '',
  reviewedAt: '',
  items: [
    'Documentos pessoais do proprietário ou possuidor',
    'Matrícula, escritura, contrato ou comprovantes de posse',
    'Documentos disponíveis do imóvel, como IPTU para imóveis urbanos ou CAR, CCIR e ITR para imóveis rurais',
  ],
},
  {
    area: 'Consultoria Jurídica para o Agro',
    approved: false,
    reviewedBy: '',
    reviewedAt: '',
    items: [
      'Documento de identificação do interessado',
      'Contratos e documentos relacionados à atividade rural',
      'Notificações, comunicações e documentos relevantes para a análise',
    ],
  },
  {
  area: 'Direito de Família e Sucessões',
  approved: false,
  reviewedBy: '',
  reviewedAt: '',
  items: [
    'Documento de identificação do interessado',
    'Certidões de nascimento, casamento ou óbito, conforme o caso',
    'Documentos relacionados à demanda, como comprovantes de renda e despesas, documentos de bens, acordos ou decisões judiciais existentes',
  ],
},
],


professionalProfiles: [
  {
    slug: 'equipe-juridica',
    registration: '',
    education: [],
    areas: [
      'Direito Previdenciário',
      'Direito Bancário',
      'Direito Cível',
      'Direito Imobiliário',
      'Direito Trabalhista',
      'Direito Público',
    ],
    biography: 'Nossa equipe atua na advocacia e consultoria jurídica, oferecendo orientação e acompanhamento nas áreas Previdenciária, Bancária, Cível, Imobiliária, Trabalhista e de Direito Público. Com atuação em Picos e Itainópolis/PI e atendimento on-line, buscamos oferecer soluções jurídicas responsáveis, com ética, transparência e atenção individualizada às necessidades de cada cliente.',
    email: '',
    whatsapp: '',
  },
  {
    slug: 'equipe-juridica',
    registration: '',
    education: [],
    areas: [
      'Direito Previdenciário',
      'Direito Bancário',
      'Direito Cível',
      'Direito Imobiliário',
      'Direito Trabalhista',
      'Direito Público',
    ],
    biography: 'Nossa equipe atua na advocacia e consultoria jurídica, oferecendo orientação e acompanhamento nas áreas Previdenciária, Bancária, Cível, Imobiliária, Trabalhista e de Direito Público. Com atuação em Picos e Itainópolis/PI e atendimento on-line, buscamos oferecer soluções jurídicas responsáveis, com ética, transparência e atenção individualizada às necessidades de cada cliente.',
    email: '',
    whatsapp: '',
  },
  {
    slug: 'equipe-juridica',
    registration: '',
    education: [],
    areas: [
      'Direito Previdenciário',
      'Direito Bancário',
      'Direito Cível',
      'Direito Imobiliário',
      'Direito Trabalhista',
      'Direito Público',
    ],
    biography: 'Nossa equipe atua na advocacia e consultoria jurídica, oferecendo orientação e acompanhamento nas áreas Previdenciária, Bancária, Cível, Imobiliária, Trabalhista e de Direito Público. Com atuação em Picos e Itainópolis/PI e atendimento on-line, buscamos oferecer soluções jurídicas responsáveis, com ética, transparência e atenção individualizada às necessidades de cada cliente.',
    email: '',
    whatsapp: '',
  },
],

social: {
  instagram: 'https://www.instagram.com/leiteholandacarvalhoadv',
},



linkBio: {
  title: '',
  eyebrow: 'Advocacia e Consultoria Jurídica',
  description: 'Atuação nas áreas Previdenciária, Bancária, Cível, Imobiliária, Trabalhista e de Direito Público. Orientação jurídica responsável, atendimento humanizado e soluções estratégicas para proteger seus direitos. Atendemos em Picos e Itainópolis/PI, com atendimento on-line.',
  coverImage: '',
  coverAlt: '',
  teamTitle: 'Fale com nossa equipe jurídica',
  whatsappMessage: 'Olá! Vim pelo link da bio e gostaria de receber orientação jurídica. Gostaria de saber como funciona o atendimento.',
  // Mostra no máximo 3 pessoas de team. Para ocultar uma, use linkBio: false nela.
  quickLinks: [
    {
      label: 'Conheça nosso escritório',
      description: 'Advocacia e consultoria jurídica em Picos e Itainópolis/PI',
      href: '#inicio',
      icon: 'mdi-web',
    },
    {
      label: 'Agendar atendimento',
      description: 'Atendimento jurídico on-line com praticidade e segurança',
      href: '#agendamento',
      icon: 'mdi-calendar-outline',
    },
    {
      label: 'Áreas de atuação',
      description: 'Previdenciário, Bancário, Cível, Imobiliário, Trabalhista e Público',
      href: '#areas',
      icon: 'mdi-scale-balance',
    },
    {
      label: 'Prepare seu atendimento',
      description: 'Confira os documentos necessários para sua consulta jurídica',
      href: '#documentos',
      icon: 'mdi-file-document-outline',
    },
  ],
},


// As notas e avaliações são obtidas pelo servidor; nunca preencha notas fictícias.
googleReviews: {
  enabled: true,
  showOnLinkBio: true,
  endpoint: '/api/google-reviews',
  title: 'Avaliações no Google',
  description: 'Conheça as avaliações compartilhadas sobre o atendimento jurídico de Ramon Bastos.',
  profileUrl: '',
  writeReviewUrl: '',
},


about: {
  title: 'Advocacia e Consultoria Jurídica com compromisso e responsabilidade',
  photo: '/media/Equipe.png',
  photoAlt: 'Equipe de advocacia e consultoria jurídica com atuação em Picos e Itainópolis, Piauí',
  text: 'Nosso escritório oferece serviços de advocacia e consultoria jurídica, com atuação nas áreas Previdenciária, Bancária, Cível, Imobiliária, Trabalhista e de Direito Público. Atendemos clientes em Picos e Itainópolis, no Piauí, além de disponibilizar atendimento on-line para proporcionar maior comodidade e acessibilidade. Nosso compromisso é compreender as particularidades de cada situação, oferecer orientação jurídica clara e desenvolver estratégias responsáveis, pautadas pela ética, transparência e respeito aos direitos de nossos clientes.',
  subtitle: 'Orientação jurídica especializada, atendimento humanizado e soluções responsáveis para pessoas físicas e jurídicas.',
  cards: [
    {
      icon: 'fa-solid fa-scale-balanced',
      title: 'Segurança jurídica',
      desc: 'Orientação e acompanhamento jurídico para decisões fundamentadas e proteção dos seus direitos.',
    },
    {
      icon: 'fa-solid fa-handshake-angle',
      title: 'Atendimento humanizado',
      desc: 'Atendimento próximo, transparente e individualizado, respeitando as necessidades de cada cliente.',
    },
    {
      icon: 'fa-solid fa-gavel',
      title: 'Atuação estratégica',
      desc: 'Análise técnica e desenvolvimento de estratégias jurídicas adequadas às particularidades de cada caso.',
    },
    {
      icon: 'fa-solid fa-chart-line',
      title: 'Consultoria preventiva',
      desc: 'Orientação jurídica para prevenir conflitos, reduzir riscos e proporcionar maior segurança nas relações jurídicas.',
    },
  ],
},

practiceAreas: [
  {
    title: 'Direito Previdenciário',
    description: 'Orientação e acompanhamento em aposentadorias, pensões, benefícios por incapacidade, BPC/LOAS, revisões de benefícios e demandas administrativas ou judiciais perante o INSS.',
    icon: 'fa-solid fa-hand-holding-heart',
  },
  {
    title: 'Direito Bancário',
    description: 'Análise e revisão de contratos bancários, cobranças indevidas, empréstimos, financiamentos, fraudes financeiras e conflitos nas relações entre consumidores e instituições financeiras.',
    icon: 'fa-solid fa-building-columns',
  },
  {
    title: 'Direito Cível',
    description: 'Assessoria e representação jurídica em contratos, responsabilidade civil, indenizações, cobranças, relações de consumo e resolução de conflitos entre pessoas físicas e jurídicas.',
    icon: 'fa-solid fa-scale-balanced',
  },
  {
    title: 'Direito Imobiliário',
    description: 'Orientação jurídica em compra e venda de imóveis, regularização imobiliária, contratos de locação, questões de posse, propriedade, usucapião e conflitos imobiliários.',
    icon: 'fa-solid fa-house',
  },
  {
    title: 'Direito Trabalhista',
    description: 'Orientação e atuação em relações de trabalho, verbas rescisórias, reconhecimento de vínculo empregatício, direitos trabalhistas, rescisões contratuais e demandas judiciais trabalhistas.',
    icon: 'fa-solid fa-briefcase',
  },
  {
    title: 'Direito Público',
    description: 'Consultoria e atuação jurídica em questões relacionadas à Administração Pública, direitos de servidores públicos, concursos, processos administrativos e demandas envolvendo órgãos públicos.',
    icon: 'fa-solid fa-landmark',
  },
],

serviceJourney: [
  {
    icon: 'mdi-message-text-outline',
    title: 'Primeiro contato',
    text: 'Entre em contato por WhatsApp, telefone ou formulário e apresente sua necessidade jurídica. O atendimento pode ser realizado on-line, com suporte para clientes de Picos, Itainópolis e outras localidades.',
  },
  {
    icon: 'mdi-account-search-outline',
    title: 'Análise inicial',
    text: 'Nossa equipe avalia as informações apresentadas e orienta sobre a documentação necessária para compreender as particularidades da sua situação.',
  },
  {
    icon: 'mdi-file-sign',
    title: 'Orientação e estratégia',
    text: 'Após a análise, apresentamos as possibilidades jurídicas, esclarecemos dúvidas e orientamos sobre os próximos passos adequados ao seu caso.',
  },
],

faq: [
  {
    question: 'Quais áreas do Direito o escritório atende?',
    answer: 'Nosso escritório atua nas áreas de Direito Previdenciário, Bancário, Cível, Imobiliário, Trabalhista e Público. Oferecemos orientação e acompanhamento jurídico em demandas administrativas, consultivas e judiciais, conforme as particularidades de cada situação.',
  },
  {
    question: 'Quais documentos preciso apresentar para uma consulta jurídica?',
    answer: 'A documentação necessária depende da área e da natureza do atendimento. De modo geral, podem ser solicitados documentos pessoais, contratos, comprovantes, notificações, processos ou outros registros relacionados à situação apresentada. Nossa equipe orientará sobre os documentos específicos durante o contato inicial.',
  },
  {
    question: 'O escritório oferece atendimento on-line?',
    answer: 'Sim. Oferecemos atendimento jurídico on-line para proporcionar maior praticidade e acessibilidade. O contato inicial pode ser realizado pelos canais digitais do escritório, permitindo o agendamento de consultas e o envio de documentos. Atendemos clientes de Picos, Itainópolis e outras localidades, conforme a natureza da demanda.',
  },
],

team: [
  {
    name: 'Dra. Roseane Holanda',
    role: 'Advocacia e Consultoria Jurídica',
    description: 'Atuação nas áreas Previdenciária, Bancária, Cível, Imobiliária, Trabalhista e de Direito Público, oferecendo orientação jurídica, atendimento individualizado e acompanhamento responsável das demandas de nossos clientes em Picos, Itainópolis e por meio de atendimento on-line.',
    photo: '/IMGADV/01.webp',
    instagram: '',
    linkedin: '',
  },
  {
    name: 'Dra. Mariana Holanda',
    role: 'Advocacia e Consultoria Jurídica',
    description: 'Atuação nas áreas Previdenciária, Bancária, Cível, Imobiliária, Trabalhista e de Direito Público, oferecendo orientação jurídica, atendimento individualizado e acompanhamento responsável das demandas de nossos clientes em Picos, Itainópolis e por meio de atendimento on-line.',
    photo: '/IMGADV/02.webp',
    instagram: '',
    linkedin: '',
  },
  {
    name: 'Dr. José Wesley',
    role: 'Advocacia e Consultoria Jurídica',
    description: 'Atuação nas áreas Previdenciária, Bancária, Cível, Imobiliária, Trabalhista e de Direito Público, oferecendo orientação jurídica, atendimento individualizado e acompanhamento responsável das demandas de nossos clientes em Picos, Itainópolis e por meio de atendimento on-line.',
    photo: '/IMGADV/03.webp',
    instagram: '',
    linkedin: '',
  },
],

testimonials: [],

seo: {
  title: 'Advocacia e Consultoria Jurídica | Picos e Itainópolis - PI',
  description: 'Escritório de advocacia e consultoria jurídica em Picos e Itainópolis, Piauí. Atuação em Direito Previdenciário, Bancário, Cível, Imobiliário, Trabalhista e Público. Atendimento jurídico on-line.',
},

whatsappWidget: {
  messages: [
    'Precisa de orientação jurídica? Nossa equipe está disponível para atender você.',
    'Dúvidas sobre aposentadoria, questões bancárias, trabalhistas ou imobiliárias? Entre em contato e conheça nossos serviços.',
  ],
  firstDelay: 12_000,
  interval: 60_000,
},
})


export const whatsappUrl = () => {
  const message = encodeURIComponent(siteConfig.contact.whatsappMessage)
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`
}
