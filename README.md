# ORVAE — Votação de duas perguntas

## Estrutura
- `index.html`: landing page, animações, duas perguntas e integração Supabase num **único ficheiro HTML**. CSS e JavaScript incluídos no próprio ficheiro.
- `supabase-setup.sql`: cria a tabela `public.orvae_votes` e a função `public.submit_orvae_vote`.

## Fluxo
1. Escolher 1 de 8 categorias de suplementos; a página muda imediatamente para a pergunta de sabores.
2. Escolher 1 de 12 sabores e carregar em **Enviar o meu voto**.
3. Surge a confirmação só depois de o Supabase responder com sucesso.

## Publicar no GitHub Pages
1. Colocar `index.html` na **raiz da branch main** do repositório GitHub Pages (não colocar o ZIP, nem um segundo HTML).
2. Settings > Pages > Deploy from a branch > main > /(root).
3. Verificar Actions e atualizar o browser sem cache (`Ctrl+Shift+R`).

## Preparar Supabase
1. Ir a SQL Editor do projeto `qtrmxooicythgpqfqkbg`, colar e executar `supabase-setup.sql`.
2. O HTML já contém a URL base e a chave **publishable**, que são credenciais públicas e não autorizam ler a tabela.
3. Nunca adicionar `service_role`, `sb_secret_` ou passwords ao HTML público.
4. Enviar um voto de teste e verificar:

```sql
select * from public.orvae_votes order by created_at desc limit 20;
select supplement, count(*) as votos from public.orvae_votes group by 1 order by votos desc;
select flavor, count(*) as votos from public.orvae_votes group by 1 order by votos desc;
```

## Nota
O endpoint aceita votos públicos anónimos. A chave pública não é um antispam. Para campanhas com tráfego elevado, adicionar Cloudflare Turnstile / proteção de bots, rate limiting no servidor e política de privacidade conforme necessário. O identificador de submissão armazenado na sessão evita duplicações em reenvios com a mesma sessão. A lista de sabores é exploratória, não garante viabilidade de cada formulação.
