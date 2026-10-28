# Avaliações do Google no site

Esta atualização acrescenta a seção **Avaliações** ao site e um resumo na **link na bio**. O visual usa as cores do escritório e adapta os cartões para computador, tablet e celular.

## O que está implementado

- Nota geral e quantidade de avaliações obtidas do Google.
- Até cinco comentários retornados pela Places API (New), na ordem de relevância do Google, incluindo notas baixas quando retornadas.
- Nome e foto pública do autor, data, estrelas e comentário.
- Leitura completa de textos longos e acesso ao original quando houver tradução.
- Navegação por botões, teclado e deslize no celular.
- Links oficiais para consultar o perfil, publicar uma avaliação e consultar ou reportar um comentário, quando fornecidos pelo Google.
- Resumo na bio, sem consultar o campo de comentários quando somente a nota geral é necessária.
- Carregamento quando a seção entra na tela, estados de falha, tentativa manual e ausência de avaliações.
- Alto contraste, texto ampliado, nomes acessíveis dos controles e movimento reduzido.
- Páginas públicas sobre uso e privacidade dessa integração.

**Importante para ativar:** o arquivo recebido não informa um perfil real do Google Maps nem uma chave da Places API. Esses dados não foram inventados. O código está pronto; os dados reais aparecem após a configuração abaixo. Sem ela, a interface informa que o perfil ainda será conectado e não exibe notas ou comentários de exemplo.

## 1. Identificar o perfil correto

Abra o perfil do escritório no Google Maps e confira nome, endereço e cidade. Você precisa do **Place ID**, que identifica o estabelecimento na API. O link de compartilhamento do Maps e o Place ID são informações diferentes.

Use o [localizador oficial de Place ID](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) ou siga a [documentação de IDs de lugares](https://developers.google.com/maps/documentation/places/web-service/place-id). Pesquise o escritório correto e copie o identificador.

Coloque o identificador em `GOOGLE_PLACE_ID`. Não coloque a URL do Maps nesse campo. O servidor também aceita a forma `places/IDENTIFICADOR`.

## 2. Preparar a chave do Google

No [Google Cloud Console](https://console.cloud.google.com/):

1. Selecione ou crie o projeto que usará essa integração.
2. Vincule uma conta de faturamento ao projeto, conforme exigido pelo Google Maps Platform.
3. Em **APIs e serviços**, ative **Places API (New)**.
4. Em **Credenciais**, crie uma chave de API.
5. Restrinja a chave à **Places API (New)** e configure uma quota de uso adequada ao seu projeto.
6. Use essa chave em `GOOGLE_PLACES_API_KEY`, exclusivamente no servidor.

Veja o [guia oficial de configuração e chaves](https://developers.google.com/maps/documentation/places/web-service/get-api-key).

A chave não vai em `siteConfig.js`, no HTML, em componentes Vue nem em uma variável com prefixo `VITE_`. A consulta ao Google ocorre na função do servidor; o navegador recebe apenas os dados públicos normalizados.

## 3. Ativar no computador / PowerShell

Abra a pasta `oabpi-melhorado` no VS Code. No terminal:

```powershell
npm install
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Edite o arquivo `.env.local` e preencha:

```dotenv
GOOGLE_PLACES_API_KEY=SUA_CHAVE_REAL_DO_GOOGLE
GOOGLE_PLACE_ID=PLACE_ID_REAL_DO_ESCRITORIO
```

Se o arquivo já continha outras variáveis, mantenha-as e acrescente as duas acima. O arquivo `.env.local` está protegido pelo `.gitignore` e não foi incluído no ZIP.

Inicie o site:

```powershell
npm run dev
```

Com a porta padrão do projeto, abra:

- Site e seção: `http://localhost:3000/#avaliacoes`
- Link na bio: `http://localhost:3000/#/linkbio`
- Diagnóstico da integração: `http://localhost:3000/api/google-reviews`

O endpoint local é atendido pelo próprio Vite. **Não é necessário iniciar uma segunda API nem manter outro terminal aberto.** Depois de alterar variáveis, reinicie o Vite.

Se o PowerShell bloquear o comando `npm`, use `npm.cmd` no lugar, por exemplo `npm.cmd run dev`.

Para verificar produção local:

```powershell
npm run build
npm run preview
```

O preview também atende o endpoint local. Use a porta informada no terminal; o `dist` hospedado sozinho em um servidor puramente estático precisa de uma API separada. Na Vercel, a função fornecida neste projeto atende essa necessidade.

## 4. Ativar na Vercel

No projeto existente da Vercel, acesse **Settings → Environment Variables** e adicione:

| Nome | Conteúdo | Visibilidade |
| --- | --- | --- |
| `GOOGLE_PLACES_API_KEY` | Chave da Places API (New) | Secret |
| `GOOGLE_PLACE_ID` | ID do perfil correto | Config |

Selecione os ambientes em que deseja usar a integração, especialmente **Production**. Faça um novo deploy depois de salvar as variáveis. Mantenha a configuração do framework **Vite**, comando de build `npm run build` e saída `dist`.

O arquivo `api/google-reviews.js` funciona como uma Vercel Function. Em produção, a Vercel executa a função; seu computador não precisa ficar ligado. Esta entrega não alterou contas, faturamento nem variáveis de ambiente externas e não realizou um deploy.

Após publicar, abra `/api/google-reviews` no seu domínio. Um retorno com `status: "ready"` confirma que o servidor recebeu dados do perfil configurado. Confira o nome retornado para garantir que o ID pertence ao escritório correto.

## 5. Personalizar a seção

Em `src/config/siteConfig.js`, o novo bloco é:

```js
googleReviews: {
  enabled: true,
  showOnLinkBio: true,
  endpoint: '/api/google-reviews',
  title: 'Avaliações no Google',
  description: 'Conheça as experiências compartilhadas sobre nosso atendimento.',
  profileUrl: '',
  writeReviewUrl: '',
},
```

| Campo | Função |
| --- | --- |
| `enabled` | Exibe ou oculta a seção, os atalhos e o resumo. |
| `showOnLinkBio` | Controla somente o resumo da bio. |
| `endpoint` | Endereço da função; normalmente não precisa mudar. |
| `title`, `description` | Textos de apresentação. |
| `profileUrl` | URL completa do perfil no Google Maps. É usada como alternativa quando a consulta automática não estiver disponível. |
| `writeReviewUrl` | Link oficial **Pedir avaliações** do Perfil da Empresa. É usado se a API não disponibilizar um link para avaliar. |

Os botões aceitam URLs HTTPS. Os links recebidos do Google são usados prioritariamente. Você pode preencher os dois links públicos mesmo sem uma chave: os botões funcionam, mas a nota geral e os comentários dentro do site dependem da API.

No Perfil da Empresa, use a opção de pedir avaliações para obter o link oficial de publicação. Não copie o endereço de uma avaliação pertencente a outro estabelecimento.

As cores vêm de `theme`. Não é necessário alterar CSS para usar outra identidade visual.

## Uso, atualização e cobrança

A API retorna uma seleção de até cinco avaliações. Não é uma exportação de todo o histórico. A nota geral e a contagem vêm dos campos do estabelecimento; não são calculadas somente com os cinco cartões.

Uma nova exibição da seção consulta o Google. O site não grava os comentários em banco, arquivo, `localStorage` ou cache da CDN. O Google determina quais comentários retorna e quando atualiza seus dados. Não há atualização automática em intervalo fixo nem consultas repetidas em segundo plano.

No site completo são solicitados os campos de avaliações. Na bio são solicitados somente os dados de resumo. Os campos têm categorias de cobrança diferentes. Consulte [uso e faturamento](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing) e a [lista oficial de campos e categorias](https://developers.google.com/maps/documentation/places/web-service/data-fields) antes de ativar. Não há promessa de uso gratuito ilimitado.

Os arquivos `tests/googleReviews.fixture.js` e `tests/googleReviews.test.js` contêm dados fictícios claramente identificados para testes. **Eles não são importados pela interface, publicados como avaliações nem usados quando a API está sem configuração.**

## Diagnóstico

| Resposta do endpoint | O que conferir |
| --- | --- |
| `status: "unconfigured"` | Chave e/ou Place ID ausentes no ambiente da função. |
| `GOOGLE_ACCESS_DENIED` | Chave, ativação da API, restrições e faturamento do projeto Google. |
| `GOOGLE_QUOTA_EXCEEDED` | Quota do Google atingida; consulte o painel do projeto. |
| `GOOGLE_PLACE_NOT_FOUND` | Place ID não encontrado ou desatualizado. |
| `INVALID_PLACE_ID` | Campo preenchido com uma URL ou caracteres incompatíveis. |
| `INVALID_GOOGLE_RESPONSE` | Resposta inesperada ou identificador diferente do solicitado. |
| `GOOGLE_TIMEOUT` / `GOOGLE_UNAVAILABLE` | Falha temporária ou tempo excedido; tente novamente. |

A interface mantém um aviso compreensível e os links públicos configurados quando a consulta falha. Ela não substitui avaliações reais por comentários de demonstração.

## Verificação e arquivos

Execute os testes do servidor:

```powershell
npm run test:google-reviews
```

Os testes não consultam nem cobram a API Google: usam uma resposta simulada interna. A verificação visual também usa dados de ensaio; a consulta real depende das suas credenciais e do perfil.

Arquivos principais: `src/components/GoogleReviewsSection.vue`, `ReviewStars.vue`, `GoogleReviewsPolicy.vue`, `server/googleReviews.js`, `api/google-reviews.js`, `dev/googleReviewsPlugin.mjs`, `.env.example` e as integrações em `App.vue`, `InstitutionalSite.vue`, `HeaderNavigation.vue`, `FooterSection.vue`, `LinkBioPage.vue` e `vite.config.mjs`.

As páginas `/#/avaliacoes/privacidade` e `/#/avaliacoes/termos` explicam especificamente essa integração e incorporam links às condições do Google. Elas não substituem documentos mais amplos que o escritório utilize para outras funcionalidades.

Se você for aplicar os arquivos em uma cópia local que já foi personalizada, mescle o bloco `googleReviews` na sua configuração em vez de substituir todos os dados do escritório.
