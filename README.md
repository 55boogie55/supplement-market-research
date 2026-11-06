# FORM / LAB — estudo de mercado de suplementos

Landing page estática em HTML, CSS e JavaScript. Inclui um questionário de 8 perguntas e uma área de resultados agregados.

## 1. Começar sem base de dados (pré-visualização)

1. Abre a pasta no Visual Studio Code.
2. Instala a extensão **Live Server** (Ritwick Dey), caso ainda não a tenhas.
3. Abre `index.html` e escolhe **Open with Live Server**.
4. Preenche e submete o questionário.

Sem Supabase configurado, o site funciona em modo de demonstração: as respostas ficam apenas guardadas no navegador onde foram submetidas. Não uses este modo para recolher respostas de várias pessoas.

## 2. Ligar o Supabase para recolher respostas reais

1. Cria um projeto em [supabase.com](https://supabase.com/).
2. No projeto, abre o **SQL Editor**.
3. Abre o ficheiro `supabase/schema.sql`, copia todo o conteúdo, cola no SQL Editor e executa.
4. Nas definições / área de API do projeto, copia o **Project URL** e a **Publishable key** (ou a antiga `anon` key, se for a que o teu projeto disponibiliza).
5. Abre `config.js` e preenche os dois valores:

```js
export const SUPABASE_URL = "https://O-TEU-PROJETO.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "A-TUA-PUBLISHABLE-KEY";
```

6. Guarda o ficheiro e volta a abrir / atualizar o site.
7. Faz um teste com uma resposta. Depois abre o site noutro navegador ou telemóvel e confirma que o total de respostas aumenta.

**Importante:** a Publishable key (ou antiga `anon` key) é concebida para utilização no frontend. Nunca coloques no site uma `service_role` key, secret key, password ou credenciais privadas. O SQL deste projeto bloqueia o acesso direto à tabela e expõe apenas duas funções controladas para submeter respostas e consultar totais agregados.

## 3. Publicar através do GitHub Pages

1. Cria um repositório no GitHub, por exemplo `supplement-market-research`.
2. Envia para o repositório todos os ficheiros desta pasta, mantendo a pasta `supabase`.
3. No GitHub, abre **Settings → Pages**.
4. Em **Build and deployment**, escolhe **Deploy from a branch**.
5. Seleciona a branch `main` e a pasta `/ (root)`, depois guarda.
6. O GitHub Pages vai apresentar o endereço público do site. A publicação pode demorar alguns minutos.

O site não precisa de um processo de build: são ficheiros estáticos. A ligação ao Supabase é feita no navegador através do cliente JavaScript carregado por CDN.

## 4. O que está incluído

- `index.html`: conteúdo e estrutura da landing page.
- `styles.css`: identidade visual, layout responsivo e estilos.
- `app.js`: validação, submissão, modo de demonstração e gráficos de resultados.
- `config.js`: URL e chave pública do Supabase.
- `supabase/schema.sql`: tabela, validações, permissões e funções SQL.

## 5. Limitações importantes desta primeira versão

- O bloqueio de uma resposta por navegador é apenas uma conveniência; não é um mecanismo forte contra votos repetidos ou automatizados. Uma pessoa pode contorná-lo usando outro navegador ou apagando os dados locais.
- Não existe painel privado de administração nesta versão. Podes consultar / exportar as respostas no Supabase, com a tua conta de administrador.
- Não recolhe emails, nomes ou informação clínica.
- Antes de recolher dados em escala, acrescenta uma nota de privacidade adequada ao teu projeto e confirma os requisitos legais aplicáveis. Não peças dados de saúde neste questionário.
- Os conceitos apresentados são hipóteses para estudo de mercado; não são produtos à venda nem alegações de eficácia.

## 6. Consulta dos dados no Supabase

No SQL Editor, enquanto administrador do projeto, podes consultar respostas com:

```sql
select *
from public.market_survey_responses
order by created_at desc;
```

Para obter totais por conceito:

```sql
select product_interest, count(*) as total
from public.market_survey_responses
group by product_interest
order by total desc;
```
