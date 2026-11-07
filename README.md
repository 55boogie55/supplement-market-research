# FORM / LAB V9 — quiz numa só página e ligação Supabase corrigida

**Um único HTML:** `index.html`. O CSS e o JavaScript ficam em `styles.css` e `app.js`, e as ilustrações na pasta `assets/`. Não há `quiz.html`.

## O que mudou na V9

- A luz surge **gradualmente** sobre os cartões sem os transformar instantaneamente em pêssego. A cor base mantém-se escura.
- Ilustrações com movimento orgânico, órbitas lentas, microinteração ao mover o rato e animação de seleção subtil.
- O site respeita `prefers-reduced-motion` e adapta-se a telemóveis.
- **Supabase:** aceita tanto o Project URL (`https://ID.supabase.co`) como o Data API URL (`https://ID.supabase.co/rest/v1/`) sem repetir `/rest/v1/`.
- Mensagens de erro distintas para `config.js` ausente, valores de exemplo, URL inválido, chave inválida e erros HTTP do Supabase.
- URLs de `config.js`, `app.js` e `styles.css` têm versão nova (`?v=9.1`) para evitar usar ficheiros antigos em cache.

## Ficheiros incluídos

- `index.html` — landing page e quiz de oito perguntas no mesmo documento.
- `styles.css` — identidade visual, animações e responsividade.
- `app.js` — perguntas, transições, navegação, revisão e POST à função RPC.
- `assets/*.svg` — imagens ilustradas usadas ao longo das perguntas.
- `config.js` — **já contém o Project URL e a publishable key pública fornecidos pelo dono do projeto**. Não guardes neste ficheiro segredos.
- `config.example.js` — valores de exemplo, apenas como referência.
- `supabase-setup.sql` — cria `public.form_lab_responses` e `public.submit_form_lab_response`.

## IMPORTANTE: não basta atualizar config.js

O site publicado tem de conter **todos** estes ficheiros atualizados na mesma branch e pasta:

1. `index.html`
2. `app.js`
3. `styles.css`
4. `config.js`
5. `assets/` (as imagens necessárias)

`index.html` agora carrega `config.js?v=9.1` **antes** de `app.js?v=9.1`.

## Configuração Supabase

Este pacote foi preparado com o URL público informado pelo dono do projeto:

```js
window.FORM_LAB_CONFIG = {
  SUPABASE_URL: 'https://qtrmxooicythgpqfqkbg.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_…' // o valor completo está no config.js
};
```

A API de envio é:

```
POST https://qtrmxooicythgpqfqkbg.supabase.co/rest/v1/rpc/submit_form_lab_response
```

Se **ainda não executaste** `supabase-setup.sql` neste projeto Supabase:

1. Abre https://supabase.com/dashboard → escolhe o projeto correto.
2. Vai a **SQL Editor → New query**.
3. Cola o conteúdo de `supabase-setup.sql` e executa **Run**.
4. Confirma no **Table Editor** que `public.form_lab_responses` existe.

A tabela não pode ser lida publicamente; a função RPC valida os dados antes de inserir. A publishable key é apropriada para o browser, **mas não é autenticação de utilizadores**. Nunca publiques `sb_secret_`, `service_role` ou outra chave privada. Para tráfego elevado, adiciona proteção anti-spam no backend.

### Testar uma resposta verdadeira

1. Publica o site com os novos ficheiros e confirma o deploy verde em **Actions**.
2. Abre o site e termina as oito perguntas.
3. Carrega em **Enviar as minhas escolhas**.
4. Se aparecer **Respostas guardadas no Supabase**, a função RPC aceitou o pedido; confirma a linha em **Table Editor → form_lab_responses**.
5. Se aparecer um erro, abre `F12 → Network`, filtra por `submit_form_lab_response` e inspeciona o código HTTP:
   - **404 / PGRST202**: a função SQL não existe, tem argumentos diferentes ou a cache do esquema ainda não atualizou.
   - **401 / 403**: chave, permissões ou privilégios de execução incorretos.
   - **400**: payload ou validações incompatíveis.
   - **CORS / failed to fetch**: erro de rede, bloqueio ou origem/URL inválido.

Consulta os dados no **SQL Editor**:

```sql
select id, created_at, product_interest, preferred_format, price_range
from public.form_lab_responses
order by created_at desc
limit 20;
```

**Atenção:** os testes incluídos no desenvolvimento simularam um servidor Supabase; não são prova de que o Supabase real recebeu dados. É obrigatório fazer este teste depois da publicação.

## Publicar corretamente no GitHub

O repositório é `https://github.com/55boogie55/supplement-market-research`. Usa a **pasta clonada do repositório original**, a que tem `origin` correto, e não uma pasta Git independente com outro `Initial commit`.

Extrai o ZIP e copia o conteúdo **para a raiz dessa pasta**, substituindo os ficheiros de mesmo nome (não copies o ZIP como ficheiro isolado). Não substituas a pasta `.git`.

No terminal dessa pasta:

```powershell
git status -sb
git add index.html app.js styles.css config.js config.example.js README.md supabase-setup.sql assets/
git commit -m "FORM LAB V9: animacoes suaves e correcao do Supabase"
git push origin main
```

No GitHub, abre **Settings → Pages**, verifica **Deploy from a branch → main → /(root)**, e depois **Actions** para confirmar o deploy.

Depois do deploy visita:

- Site: https://55boogie55.github.io/supplement-market-research/
- Configuração carregada (confirma que é a V9): https://55boogie55.github.io/supplement-market-research/config.js?v=9.1

Usa `Ctrl + Shift + R` se o browser estiver a mostrar ficheiros antigos.

## Acessibilidade

- Botões reais, navegação por teclado e estados de foco; `Escape` para fechar o quiz.
- Opção Voltar, revisão editável e envio apenas na confirmação final.
- Movimento reduzido respeitado nas preferências do sistema.
