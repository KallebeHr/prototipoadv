# Site institucional de advocacia

Modelo personalizável em Vue 3 + Vite, com pesquisa local, áreas de atuação, equipe, formulário conectado ao WhatsApp, Leaflet/OpenStreetMap, menu móvel fullscreen, leitura em voz alta, acessibilidade optativa e WhatsApp flutuante. Layout editorial baseado na opção 3 aprovada.

```bash
npm install
npm run dev
```

Edite `src/config/siteConfig.js`. Consulte **CONFIGURACAO.md** para fotos, paleta, nomes, contato, publicação e limitações do VLibras.

O ponto de entrada é `src/App.vue`; a página atual está em `src/components/InstitutionalSite.vue`, e as opções de acessibilidade em `src/components/AccessibleTools.vue`. Componentes anteriores foram mantidos como referência, mas não são montados pelo novo ponto de entrada.

```bash
npm run build
npm run preview
```

Leia `design-qa.md` para os testes realizados e as limitações observadas. Os dados e fotografias são de exemplo e precisam ser substituídos antes da publicação.
