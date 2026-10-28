# Configurar os novos recursos

Tudo é editado em `src/config/siteConfig.js`. Preserve as personalizações desse arquivo ao atualizar o projeto.

## Triagem

O formulário em `ClientServices.vue` coleta área, vínculo com o escritório, motivo, nome e telefone. O visitante prepara a mensagem e então abre o WhatsApp para enviá-la. Os dados ficam apenas na memória da página até a abertura do WhatsApp; não há armazenamento no servidor nem envio automático. Configure `contact.whatsapp` com país, DDD e número reais.

## Agenda

Configure `booking.url` com o link HTTPS público da agenda que o escritório já utiliza. Nesse serviço, configure horários, duração, fuso horário, formatos presencial/vídeo, confirmação e lembretes. Teste uma reserva na agenda antes de publicar o link. O site abre essa agenda em nova aba; não replica horários e não recebe dados de reservas.

Sem esse link, o formulário recebe uma preferência de data, período e formato. Isso é somente uma solicitação pelo WhatsApp, sujeita à confirmação humana. O site não oferece horários em tempo real, não bloqueia vagas e não envia lembretes. Para concluir essas funções é necessário conectar a agenda real; não coloque horários fictícios como disponíveis.

## Documentos
 
Em `documentChecklists`, cada lista corresponde ao título exato de uma área de `practiceAreas`. As listas incluídas são rascunhos para revisão do advogado, inicialmente não publicados. Após revisar o conteúdo, preencha `reviewedBy`, `reviewedAt` (data da revisão) e altere `approved` para `true`. Sem os três campos, o site orienta o visitante a consultar o escritório. Não marque como revisado sem revisão real.

O cliente pode marcar itens separados e baixar uma lista de texto. Não há upload de documentos.

## Profissionais

`professionalProfiles` acompanha a ordem de `team`: o primeiro perfil pertence à primeira pessoa e assim por diante. Preencha `registration` (registro real), `education` (lista de formações), `areas`, `biography`, `email` e `whatsapp`. Campos vazios de formação e registro não aparecem. Não foram inventados registros ou formações.

Mantenha cada `slug` exclusivo, sem espaços ou acentos. Os links usam `#/equipe/slug`, funcionam em hospedagem estática e permitem compartilhar um perfil. Preserve a ordem dos dois arrays ao reorganizar profissionais.

## Dúvidas

Edite perguntas e respostas em `faq`. A pesquisa local ignora diferenças entre maiúsculas, minúsculas e acentos, e também está incluída na busca do cabeçalho.

## Arquivos alterados nesta atualização

- `src/config/siteConfig.js`: novas configurações.
- `src/components/ClientServices.vue`: triagem, agenda, listas e FAQ.
- `src/components/ProfessionalPage.vue`: página individual.
- `src/components/ContactSection.vue`: integração e canais.
- `src/components/TeamSection.vue`: link para cada perfil.
- `src/components/HeaderNavigation.vue`: novos resultados da pesquisa.
- `src/App.vue`: navegação por perfil.

O painel de acessibilidade foi preservado. Build de produção e verificações de lógica foram executados; não foi realizada validação visual em navegador nesta atualização.
