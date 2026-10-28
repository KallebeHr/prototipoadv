# Verificação do layout institucional ampliado

final result: passed

## Evidências e normalização

- Verdade visual: `/workspace/scratch/b5be07e94552/generated_images/exec-ca6aa3a7-c854-4cde-98ff-f4e314fa9090.png`, 1487 × 1058.
- Implementação desktop: `qa/desktop-accessibility-v2.jpg`, viewport 1363 × 936, densidade 1, estado inicial.
- Menu mobile: `qa/mobile-menu-fullscreen.jpg`, iframe CSS 390 × 844, estado aberto após a animação.
- Regiões focadas: `qa/map-location.jpg` e `qa/contact-form.jpg`, viewport desktop 1363 × 936.
- A comparação de referência e implementação foi aberta no mesmo passe visual. Os viewports não têm a mesma largura; a avaliação priorizou proporções relativas e a estrutura acima da dobra, sem atribuir diferenças originadas apenas pela escala.

## Resultado visual

O topo mantém a composição aprovada: navegação branca, masthead vermelho, busca arredondada, banner azul escuro, fotografia editorial e coluna lateral. Tipografia Roboto, paleta vermelho/navy, ritmos, imagens e cópia continuam coerentes com a referência. A nova navegação “Localização” é uma diferença intencional de conteúdo.

As novas regiões seguem a mesma linguagem: bordas finas, fundos neutros, títulos navy, pequenos rótulos vermelhos e ícones Material Design. O mapa usa tiles reais do OpenStreetMap; nenhuma ilustração foi simulada por CSS.

## Histórico de comparação

- P2 encontrado: numeração e setas do menu mobile apareciam comprimidas na navegação desktop após a primeira implementação.
- Correção: elementos auxiliares foram ocultados no desktop e habilitados apenas abaixo de 700px.
- Evidência posterior: `qa/desktop-accessibility-v2.jpg`; cabeçalho novamente limpo e proporcional à referência.
- P2 encontrado: a primeira captura do menu foi feita durante a transição e parecia translúcida.
- Correção: o estado foi recapturado após 700ms. `qa/mobile-menu-fullscreen.jpg` confirma fundo navy opaco, links legíveis e ocupação integral da viewport.

Não restaram P0/P1/P2 acionáveis. P3: substituir os perfis sociais, coordenadas, endereço e fotografias demonstrativas pelos dados reais do cliente.

## Interações e acessibilidade testadas

- Build de produção concluído.
- Desktop sem overflow horizontal; mapa Leaflet inicializado.
- Menu mobile abre em tela inteira, trava o scroll do corpo, foca o botão Fechar, fecha por Escape e devolve o foco ao botão de abertura.
- Controle Tab fica contido nos elementos do menu enquanto aberto.
- Atalhos flutuantes ficam ocultos durante o menu, evitando sobreposição.
- Espaçamento de leitura aplica classe própria; Restaurar padrão remove os ajustes.
- Leitura em voz alta chama SpeechSynthesis em `pt-BR`, com pausar/continuar/parar. O navegador remoto interrompeu a voz e exibiu o estado de erro previsto; a disponibilidade depende das vozes do aparelho.
- Formulário possui labels e campos obrigatórios; o envio final não foi executado porque abriria comunicação externa. Pelo código, ele prepara nome, telefone, assunto e mensagem no WhatsApp.
- Mapa possui nome acessível, zoom por botões, instrução de teclado e link separado para rota.
- Console: apenas mensagem da extensão do ambiente de teste; nenhum erro da aplicação registrado.

## Limites

Não houve teste em aparelho físico, leitor de tela NVDA/JAWS/VoiceOver, envio real ao WhatsApp ou auditoria formal WCAG. Web Speech, tiles do mapa e VLibras dependem de recursos externos/navegador.
