# Verificação da integração de avaliações

Data: 14/10/2026. Resultado: **código e interface aprovados nos cenários abaixo; conexão com um perfil real pendente de configuração**.

## Fluxo verificado

Visitante → seção ou resumo da bio → `/api/google-reviews` → adaptador Places API (New) → resposta normalizada → interface.

O teste de navegador utiliza a mesma função e o mesmo adaptador que o projeto entrega. Somente a resposta externa do Google é substituída por dados de ensaio. Nenhuma avaliação fictícia é usada pela interface padrão, e nenhuma consulta cobrada à API Google foi realizada nos testes.

| Verificação | Resultado |
| --- | --- |
| Compilação de produção | `npm run build` concluído. |
| ESLint nos arquivos alterados | Nenhum erro. |
| Testes do servidor | 6 testes passaram; nenhum falhou. |
| Sem configuração | Nenhuma chamada ao Google; nota e comentários não são inventados. |
| Consulta de dados | Place ID fixado no servidor, máscara de campos explícita e língua pt-BR. |
| Resumo da bio | Requisição `view=summary`, sem pedir o campo de comentários. |
| Segurança da chave | Enviada ao Google por cabeçalho; não devolvida ao navegador. |
| Métodos e parâmetros HTTP | Escrita bloqueada; visão inválida rejeitada; parâmetro de perfil do cliente não altera o perfil consultado. |
| Cache | Resposta com `no-store` no navegador e na CDN. |
| Retorno de erros | 403, 404, 429, falha de serviço, resposta inválida e tempo excedido tratados. |
| Notas e autoria | Nota geral e quantidade preservadas; autores, links e texto original mantidos. Notas baixas não são filtradas. |
| Quantidade de comentários | Limite de cinco; estados de um comentário e nenhum comentário conferidos. |
| URLs | Esquemas executáveis, dados embutidos e credenciais em URLs rejeitados. |
| Larguras | 320, 390, 768, 820, 1024 e 1440 px sem rolagem horizontal da página. |
| Textos longos | Abrir e recolher a avaliação funcionou. |
| Tradução | Alternância para texto original funcionou. |
| Carrossel | Botão de próxima avaliação moveu o conteúdo. |
| Links externos | Endereços e abertura em nova aba verificados sem publicar avaliação. |
| Acessibilidade | Texto a 150% e alto contraste verificados; nota geral legível; restauração do padrão funcionou. |
| Privacidade e retorno | Página de informações abriu e voltou à seção. |
| Bio → site | Resumo carregou e atalho abriu as avaliações completas. |
| Recuperação de falha | Estado de quota excedida exibiu aviso; tentar novamente carregou dados após recuperação do serviço. |
| Configuração reativa | Desativar e reativar a seção funcionou. |
| JavaScript | Nenhum erro de execução registrado no fluxo do navegador. |

Na inspeção foram corrigidos dois problemas: os textos acessíveis de cartões fora da tela agora ficam contidos no próprio cartão, e os links do rodapé quebram linha em telas pequenas. Os controles do carrossel foram centralizados no celular para reduzir sobreposição com os atalhos flutuantes.

## Limites

Não foram fornecidos Place ID, chave Google ou perfil real do escritório. A autenticação, o faturamento e os dados desse perfil não foram verificados. O funcionamento real é ativado com as variáveis descritas em `AVALIACOES-GOOGLE.md` e deve ser conferido no endpoint do domínio após publicar.

As verificações móveis usam navegador com viewports de celular; não constituem teste em aparelhos físicos Android/iOS ou auditoria formal com leitores de tela. As capturas de tela foram usadas internamente e não foram incluídas como novos arquivos no pacote.
