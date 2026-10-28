# Verificação da página de link na bio

Resultado: **aprovado nos cenários abaixo**. Data: 07/10/2026.

**Fluxo:** o visitante abre `/#/linkbio`, vê os dados locais do escritório e de até três profissionais, escolhe um contato ou navega para um perfil ou seção do site. A página usa `siteConfig.js`; não exige API, banco de dados ou credenciais novas.

## Evidências

| Verificação | Resultado |
| --- | --- |
| Compilação de produção | `npm run build`: concluída. |
| Análise dos arquivos alterados | ESLint: nenhum erro em `App.vue`, `LinkBioPage.vue`, `FooterSection.vue` e `siteConfig.js`. |
| Página de produção | Renderizada em Chromium, com título correto, três cartões e todas as imagens carregadas. |
| Larguras de tela | 320, 390, 520, 768, 800, 820 e 1440 px: sem rolagem horizontal. |
| Contatos gerais | Links de WhatsApp, Instagram e localização usam os valores do arquivo de configuração. |
| Contatos individuais | Número com formatação normalizado para o link do WhatsApp; mensagem identifica o profissional; Instagram individual exibido quando preenchido. |
| Quantidade de profissionais | Uma pessoa exibida; quatro pessoas habilitadas limitadas às três primeiras; pessoa oculta substituída pela próxima habilitada; lista vazia oculta a seção. |
| Número individual vazio | Botão identificado como “WhatsApp do escritório”, com mensagem indicando a pessoa e sua área. |
| Perfil e retorno | Clique em “Perfil” abre o profissional correto; voltar no navegador retorna à bio. |
| Atalho para seção | “Áreas de atuação” abre o site e posiciona a seção na tela. |
| Acesso pelo rodapé | “Link na bio” retorna à página de contatos. |
| Acesso direto | Recarregar `/#/linkbio` mantém a página; `/#/bio` e `/#/links` também reconhecidos. |
| Compartilhar | Caminho de cópia testado com clipboard simulado; endereço normalizado para `/#/linkbio` e confirmação exibida. |
| Acessibilidade | Alto contraste e texto a 150% verificados em 390 px, sem rolagem horizontal; botão Restaurar padrão funcionou. |
| Link de salto | Tecla Enter leva o foco ao conteúdo principal e mantém a rota da bio. |
| Falha de imagem | Logo substituída por iniciais; foto do profissional substituída por iniciais; capa indisponível ocultada. |
| Erros de execução | Nenhum `pageerror` registrado nos fluxos da aplicação. Nenhuma falha de recurso na abertura da bio. |

## Capturas

- `linkbio-desktop.png`: 1440 px, página de produção completa.
- `linkbio-mobile.png`: 390 px, página de produção completa.
- `linkbio-accessibility.png`: 390 px, alto contraste e texto ampliado para 150%.

As capturas finais foram inspecionadas. A conferência levou a corrigir os estilos de alto contraste e a permitir que os atalhos sociais passem para uma coluna quando o texto ampliado precisa de mais espaço.

## Limites da verificação

Os números e dados do projeto recebido continuam sendo os configurados nele. As URLs externas foram verificadas, sem envio real de mensagens, ligação ou confirmação da titularidade de perfis sociais. O compartilhamento nativo depende do navegador e não foi acionado em aparelho físico; o caminho de cópia foi simulado.

Os testes de celular usam viewports de navegador, sem validação em aparelhos físicos Android/iOS ou auditoria formal com leitores de tela. O movimento de entrada está condicionado a `prefers-reduced-motion: no-preference`; os estilos globais também desativam animações e transições quando o sistema solicita movimento reduzido.

Ao visitar as seções do site institucional, algumas imagens de mapa do OpenStreetMap ficaram indisponíveis no ambiente de teste. Isso pertence ao mapa já existente. A página de bio não carrega esse mapa: oferece o link externo de localização configurado.
