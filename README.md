# FORM / LAB V8 — um único HTML + questionário animado + Supabase

**O site inteiro usa APENAS `index.html`.** `styles.css` e `app.js` são ficheiros de apoio, não páginas adicionais. O botão **Começar a escolher** abre o quiz em ecrã completo **na mesma aba**, sem recarregar a página. O botão Fechar regressa à landing e a tecla Escape também fecha a experiência.

## Estrutura

```text
index.html             ← única página HTML
styles.css             ← cores, responsividade, transições e microinterações
app.js                 ← oito etapas, revisão e envio
config.js              ← URL do Supabase + chave PÚBLICA (edita este ficheiro)
supabase-setup.sql     ← cria uma tabela nova e o endpoint RPC
assets/                ← 4 embalagens + 28 ilustrações SVG originais
.gitignore
README.md
```

## Antes de publicar: configurar o Supabase

1. Abre o teu projeto em https://supabase.com/dashboard.
2. Vai a **SQL Editor** > **New query**.
3. Copia **todo** o conteúdo de `supabase-setup.sql` e clica em **Run**. O código cria `public.form_lab_responses` e a função `public.submit_form_lab_response`. Não modifica a antiga função `submit_survey_response` nem as tabelas anteriores.
4. Em **Connect** ou **Project Settings > API Keys**, copia o **Project URL** (exemplo `https://abcxyz.supabase.co`) e a **Publishable Key** (`sb_publishable_...`).
5. Abre `config.js` e troca os dois valores de exemplo pelos do teu projeto. O ficheiro tem de existir **publicado** junto do HTML (não pode estar no `.gitignore`).
6. **Nunca** uses `sb_secret_...`, `service_role`, passwords ou tokens de utilizador neste ficheiro. A publishable key foi concebida para frontend; a proteção está nos grants/RLS e na função SQL que validam as respostas.

O frontend faz um pedido POST a `https://TEU-PROJETO.supabase.co/rest/v1/rpc/submit_form_lab_response` com a chave no cabeçalho `apikey`. São enviados um UUID de submissão e os 8 valores escolhidos. O SQL valida tudo, impede inserção direta anónima na tabela e evita duplicados do mesmo envio. **Não precisas de Edge Functions para este fluxo simples.** Se já tens Edge Functions, continuam independentes e não são alteradas.

### Testar o armazenamento

1. Serve o projeto com VS Code **Live Server** ou `python -m http.server 8080` na pasta do projeto (não uses `file://`).
2. Abre `http://localhost:8080/` (ou o endereço Live Server); clica **Começar a escolher** e responde às oito perguntas.
3. No último ecrã, clica **Enviar as minhas escolhas**. Só se o Supabase aceitar o pedido aparece a mensagem **Respostas guardadas no Supabase**.
4. No Supabase **Table Editor**, abre `form_lab_responses` e confirma uma nova linha. Também podes usar o SQL Editor:

```sql
select id, created_at, product_interest, preferred_format, price_range
from public.form_lab_responses
order by created_at desc
limit 20;
```

Se algo falhar, a interface apresenta o erro, incluindo o código Supabase. Abre **F12 > Network > submit_form_lab_response**:

- `Configuração em falta`: `config.js` ainda tem valores de exemplo ou não carregou.
- `404` / `PGRST202`: falta executar o SQL, há erro no nome da função ou a cache do esquema ainda não atualizou.
- `401` ou `403`: a chave é incorreta, ou as permissões (`grant execute`) não foram aplicadas.
- `400` / `22023`: o SQL não corresponde aos códigos das opções na versão do JavaScript.
- `Failed to fetch` / CORS: confirma o URL, o projeto ativo e a origem; neste pacote o RPC REST não necessita de configurar CORS de uma Edge Function.

O teste sem ligação real **não demonstra** que os dados estejam na base de dados: até inserires a tua URL/chave e executares o SQL, o envio falhará de forma visível.

## Publicar no GitHub Pages

### Pelo site do GitHub (sem terminal)

1. Abre o repositório onde queres publicar a FORM / LAB, ou cria um novo repositório.
2. Extrai este ZIP; na vista do repositório, escolhe **Add file > Upload files** e envia **o conteúdo da pasta**, mantendo `index.html` na raiz e a pasta `assets/` com os SVG. Confirma **Commit changes**. (Se já existem ficheiros com o mesmo nome, é mais simples substituí-los pelo Git no computador.)
3. Em **Settings > Pages > Build and deployment**, define **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)**, e **Save**.
4. O site terá geralmente o endereço `https://UTILIZADOR.github.io/NOME-REPOSITORIO/` (ou `https://UTILIZADOR.github.io/` no repositório especial `UTILIZADOR.github.io`).
5. Confirma que `config.js` foi incluído no commit e testa uma submissão no **endereço público**, seguindo o teste do Supabase acima.

### Pelo terminal no teu repositório existente

Guarda uma cópia dos ficheiros atuais. Extrai o ZIP para a pasta do repositório, **substitui os ficheiros antigos** e remove `quiz.html` — já não é usado. Mantém outros ficheiros de que precises noutros projetos.

```bash
git status
git add index.html styles.css app.js config.js assets/ supabase-setup.sql README.md .gitignore
git rm quiz.html    # só se o ficheiro existir e estiver versionado
git commit -m "FORM LAB V8: single-page quiz e Supabase"
git push origin main
```

**Importante:** Se o teu repositório já tiver uma `config.js` com valores reais, substitui apenas o conteúdo e confirma que só contém a chave **publishable** antes de a publicar. **Não faças commit de um ficheiro que contenha chaves secretas.**

## Personalizar perguntas

No início de `app.js`, o array `steps` contém as 8 perguntas, pela ordem: suplemento → formato → sabor → frequência de compra → treino → idade → fator de decisão → preço. Cada pergunta apresenta **4 opções ilustradas**. Podes mudar textos; se alterares os valores `value` ou o número de perguntas, atualiza também as validações da função em `supabase-setup.sql` e volta a executá-lo.

## Experiência e acessibilidade

- Layout escuro e cor pêssego inspirado na captura `_v5_quiz`; animações entre ecrãs, cartões em cascata, microinteração de hover, indicador de progresso, revisão editável.
- 100% responsivo e utilizável com teclado; tecla Escape fecha o quiz; respeita `prefers-reduced-motion`.
- O progresso é guardado apenas na `sessionStorage` do navegador, para suportar recarregamentos. Nenhum dado é enviado antes do botão final.
- A tabela não fornece leitura pública aos visitantes. Por ser um formulário público, poderão existir envios automatizados; para lançamento com tráfego significativo, considera proteções anti-spam e limites de taxa no servidor (p.ex., Edge Function com Turnstile). O código atual **não implementa** essas proteções.
