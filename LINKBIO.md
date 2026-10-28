# Link na bio do escritório

A página de contatos fica em **`/#/linkbio`**. Exemplo: `https://seu-dominio.com.br/#/linkbio`. Os atalhos `/#/bio` e `/#/links` também abrem a mesma página.

Ela usa a logo, as cores, o endereço, o horário e os contatos do site. Mostra até três profissionais, com foto, nome, área, WhatsApp, Instagram (quando preenchido) e acesso ao perfil. Inclui WhatsApp geral, Instagram do escritório, localização, telefone, e-mail e atalhos para as seções do site.

## Abrir no computador

Extraia o ZIP e abra a pasta `oabpi-melhorado` no VS Code. No terminal:

```powershell
npm install
npm run dev
```

Use o endereço que aparecer no terminal e acrescente `/#/linkbio`. Com a porta padrão deste projeto: `http://localhost:3000/#/linkbio`.

Para verificar a versão de produção:

```powershell
npm run build
npm run preview
```

Abra a URL informada pelo preview e acrescente `/#/linkbio`.

## Personalizar

Edite **`src/config/siteConfig.js`**:

| Campo | Uso na página |
| --- | --- |
| `brand.shortName`, `brand.logo`, `brand.initials` | Nome e logo; as iniciais aparecem se a logo estiver vazia ou não carregar. |
| `theme` | Mesmas cores do site institucional. |
| `linkBio.title` | Nome exclusivo para a bio. Vazio: usa `brand.shortName`. |
| `linkBio.eyebrow`, `linkBio.description` | Texto acima do nome e breve apresentação. |
| `linkBio.coverImage`, `linkBio.coverAlt` | Foto de capa e descrição acessível. Vazios: usam `about.photo` e `about.photoAlt`. |
| `linkBio.teamTitle` | Título acima dos cartões de profissionais. |
| `linkBio.whatsappMessage` | Mensagem inicial do WhatsApp geral da bio. |
| `linkBio.quickLinks` | Botões de acesso às seções do site ou a links externos. |
| `contact` | WhatsApp geral, telefone, e-mail, endereço, horário e URL do mapa. |
| `social.instagram` | Instagram do escritório. Vazio: oculta esse botão. |

Imagens em `public` usam o caminho sem `public`. Exemplo: o arquivo `public/media/capa.jpg` é configurado como `/media/capa.jpg`.

## Contatos de até três advogados

Os dados vêm das listas existentes `team` e `professionalProfiles`:

| Lista | Campos |
| --- | --- |
| `team` | `name`, `role`, `photo` e `instagram` de cada profissional. |
| `professionalProfiles` | `whatsapp`, `registration` e `slug` do profissional correspondente. |

**Mantenha a mesma ordem nas duas listas:** a primeira pessoa de `team` corresponde ao primeiro perfil de `professionalProfiles`, e assim por diante. Não mude os `slug` de perfis existentes se quiser preservar os links já divulgados.

No `whatsapp` de cada perfil, coloque o número real com **55 + DDD + número**, somente dígitos. Para usar o WhatsApp geral, deixe o número individual vazio. Nesse caso, o cartão mostra **“WhatsApp do escritório”** e a mensagem identifica qual profissional a pessoa quer contatar.

No `instagram` da pessoa em `team`, coloque a URL completa, por exemplo `https://www.instagram.com/perfil-real/`. O botão individual só aparece quando o campo está preenchido.

A página mostra os três primeiros profissionais habilitados. Para ocultar alguém somente da bio, acrescente `linkBio: false` ao objeto dessa pessoa em `team`. O profissional continua aparecendo no site institucional. A bio pode mostrar uma, duas ou três pessoas; se não houver nenhuma, o bloco da equipe fica oculto.

## Alterar os atalhos

Os links internos usam os identificadores que já existem no site: `#inicio`, `#escritorio`, `#areas`, `#equipe`, `#localizacao`, `#agendamento`, `#triagem`, `#documentos` e `#contato`.

Para acrescentar um link externo em `linkBio.quickLinks`, use uma URL completa e `external: true`:

```js
{
  label: 'Instagram',
  description: 'Acompanhe nossas publicações',
  href: 'https://www.instagram.com/perfil-real/',
  icon: 'mdi-instagram',
  external: true,
}
```

Remova um objeto da lista para retirar o botão. Os nomes dos ícones seguem o pacote Material Design Icons que o site já utiliza.

## Usar na bio do Instagram

Depois de publicar a atualização do projeto, coloque **`https://seu-dominio.com.br/#/linkbio`** no campo de link do perfil. Essa rota usa o mesmo mecanismo de navegação dos perfis do site e funciona sem uma regra adicional de redirecionamento no servidor.

O botão “Compartilhar” abre as opções do aparelho quando disponíveis ou copia o endereço. A navegação por teclado, o menu de acessibilidade e a preferência por movimento reduzido também são atendidos.

Os nomes, fotos, números, perfis sociais e endereço presentes no projeto enviado foram mantidos. Substitua os dados de exemplo pelos reais antes de divulgar.

## Arquivos da atualização

- `src/components/LinkBioPage.vue`: página, layout responsivo e interações.
- `src/App.vue`: reconhecimento da rota e navegação entre bio, perfis e site.
- `src/config/siteConfig.js`: bloco `linkBio` e os dados já existentes.
- `src/components/FooterSection.vue`: acesso “Link na bio” no rodapé.
- `components.d.ts`: declaração gerada para o novo componente.
- `LINKBIO.md`: este guia.
- `qa/linkbio-verificacao.md`: resultado das verificações.

Para integrar em outra cópia do projeto que já tenha dados diferentes, **mescle o bloco `linkBio`** na configuração existente, preservando os demais cadastros. Copiar a configuração inteira da versão de exemplo substituiria esses dados.
