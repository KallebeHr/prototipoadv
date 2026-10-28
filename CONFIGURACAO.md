# Personalizar o escritório

Abra `src/config/siteConfig.js`. Os dados são reativos: alterações feitas nesse objeto atualizam os componentes. Com `npm run dev`, salvar o arquivo atualiza a prévia automaticamente. Depois de publicado, é necessário gerar e publicar um novo build; não existe painel administrativo ou banco de dados nesta versão.

## Campos usados pelo layout institucional

| Bloco | O que alterar |
| --- | --- |
| `brand` | `officeName`, `shortName`, `initials`, `logo`, `oab`, `favicon` |
| `theme` | Cores do cabeçalho, botões, textos, fundos e rodapé |
| `hero` | `title`, `backgroundImage` |
| `about` | `title`, `subtitle`, `text`, `photo`, `photoAlt` |
| `practiceAreas` | Lista de títulos e descrições; alimenta também a pesquisa |
| `team` | Nome, função, descrição e foto de cada profissional |
| `contact` | Telefone, WhatsApp, email, endereço, horário, coordenadas e link da rota |
| `social` | URLs completas das redes; deixe vazio para ocultar |
| `seo` | Título da aba e descrição da página |
| `whatsappWidget` | Mensagens, atraso inicial e intervalo em milissegundos |
| `serviceJourney` | Etapas exibidas em “Entenda como funciona” |
| `faq` | Perguntas e respostas frequentes |
| `linkBio` | Apresentação, capa, mensagem do WhatsApp e atalhos da página `/#/linkbio` |
| `googleReviews` | Seção de avaliações do Google, resumo na bio e links públicos do perfil |

Para conectar avaliações reais, siga `AVALIACOES-GOOGLE.md`. A integração usa chave privada e Place ID no servidor. Sem configuração, não são exibidos comentários ou notas de exemplo.

A página de link na bio está documentada em `LINKBIO.md`. Seus cartões usam as listas `team` e `professionalProfiles`, com limite de três profissionais.

Fotos e logos ficam em `public`. Exemplo: `public/cliente/logo.png` usa o caminho `/cliente/logo.png`. Com `brand.logo` vazio, aparece a identificação textual com as iniciais.

Em `phoneRaw` e `whatsapp`, use apenas números, incluindo 55 e DDD. As mensagens do balão aparecem por 9 segundos, somente com a aba visível; o botão X interrompe novas mensagens até recarregar a página.

O arquivo mantém alguns campos antigos (`video`, `highlight`, `eyebrow`, `subtitle` do hero, `cards`, `testimonials`) por compatibilidade com componentes legados, mas eles não aparecem na nova página. Não são necessários para personalizar o layout atual.

Para o mapa, informe `latitude`, `longitude` e `mapZoom`. Atualize também `mapUrl` com o mesmo destino. O mapa usa o pacote Leaflet e os mapas do OpenStreetMap; as imagens do mapa exigem internet. O formulário não envia os dados a um servidor: ele monta uma mensagem e abre o WhatsApp do número configurado.

## Executar no Windows / PowerShell

Extraia o ZIP, abra a pasta `oabpi` no VS Code e use o terminal:

```powershell
npm install
npm run dev
```

Abra o endereço que o Vite exibir. Para gerar a versão de produção:

```powershell
npm run build
npm run preview
```

Na Vercel: framework Vite, comando `npm run build`, pasta de saída `dist`.

## Acessibilidade e animação

As opções de alto contraste, destaque de links, espaçamento de leitura e aumento de texto começam desligadas. A leitura em voz alta usa a voz em português disponível no navegador por meio da Web Speech API; por isso, qualidade e disponibilidade variam conforme o aparelho. O site também possui landmarks, rótulos, link de salto, foco visível e menu com contenção de foco para leitores de tela e teclado. O VLibras é carregado somente ao selecionar a opção no menu inferior esquerdo. Internet e disponibilidade dos servidores do VLibras são necessárias.

GSAP executa apenas um movimento curto na foto de entrada, sem ocultar textos ou usar ScrollTrigger. A preferência de movimento reduzido do sistema é respeitada.

## Antes de publicar

Substitua nomes, OAB, telefones, endereço e fotos de exemplo pelos dados reais. A fotografia principal é uma imagem ilustrativa gerada para o modelo, não representa a equipe de um escritório real. A busca funciona sobre o conteúdo local do site. O contato utiliza links de WhatsApp, telefone e email; não há formulário com envio por servidor.
