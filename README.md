# ORVAE — Votação de duas perguntas (opções atualizadas)

## Estrutura
- `index.html`: landing page, animações, duas perguntas e integração Supabase num único ficheiro HTML.
- `supabase-setup.sql`: SQL original da V2, mantido por compatibilidade.

## Opções disponíveis
**Suplementos (7):** Creatina, Multivitamínico, Magnésio, Ómega-3, Colagénio, Vitamina D, Ashwagandha.

**Sabores (8):** Mirtilo, Frutos vermelhos, Laranja, Limão, Morango, Manga, Maracujá, Baunilha.

Foram retirados: **Proteína**, **Melancia**, **Cookie**, **Chocolate**, **Sem sabor**.

## Publicação
1. Substituir apenas o `index.html` na raiz do repositório GitHub Pages (`main`).
2. Fazer commit e push; verificar a Action do GitHub Pages.
3. Atualizar a página no navegador com `Ctrl+Shift+R` se necessário.

## Supabase
**Não é necessário voltar a executar o SQL.** O formulário continua a usar a mesma função `submit_orvae_vote` e os mesmos identificadores das opções que permaneceram. O SQL original mantém compatibilidade com dados e restrições já existentes; retirar opções do ecrã não apaga votos anteriores.

Para consultar votos recentes no SQL Editor:

```sql
select * from public.orvae_votes order by created_at desc limit 20;
```
