-- FORM / LAB V8 — executar UMA VEZ no Supabase > SQL Editor.
-- Cria uma tabela NOVA, sem alterar tabelas, RLS ou funções existentes.
-- Chave do browser: SEMPRE publishable (nunca service_role / sb_secret_).

create table if not exists public.form_lab_responses (
  id bigint generated always as identity primary key,
  submission_id uuid not null unique,
  created_at timestamptz not null default now(),
  product_interest text not null,
  preferred_format text not null,
  flavor text not null,
  purchase_frequency text not null,
  training_frequency text not null,
  age_range text not null,
  decision_factor text not null,
  price_range text not null
);

-- Os visitantes NÃO podem ler, alterar, eliminar nem inserir diretamente na tabela.
alter table public.form_lab_responses enable row level security;
revoke all on table public.form_lab_responses from public, anon, authenticated;
revoke all on sequence public.form_lab_responses_id_seq from public, anon, authenticated;
-- Não é criada nenhuma política de acesso anónimo à tabela.

-- Apenas este procedimento permite a inserção anónima, validando cada resposta.
create or replace function public.submit_form_lab_response(
  p_submission_id uuid,
  p_product_interest text,
  p_preferred_format text,
  p_flavor text,
  p_purchase_frequency text,
  p_training_frequency text,
  p_age_range text,
  p_decision_factor text,
  p_price_range text
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_id bigint;
begin
  if p_submission_id is null then
    raise exception 'Identificador da submissão obrigatório' using errcode = '22023';
  end if;
  if p_product_interest is null or p_product_interest not in
     ('creatine','protein','magnesium','ashwagandha') then
    raise exception 'Suplemento inválido' using errcode = '22023';
  end if;
  if p_preferred_format is null or p_preferred_format not in
     ('gummies','capsules','powder','shot') then
    raise exception 'Formato inválido' using errcode = '22023';
  end if;
  if p_flavor is null or p_flavor not in
     ('fruit','berries','citrus','no_preference') then
    raise exception 'Sabor inválido' using errcode = '22023';
  end if;
  if p_purchase_frequency is null or p_purchase_frequency not in
     ('monthly','every_2_3_months','when_needed','not_yet') then
    raise exception 'Frequência de compra inválida' using errcode = '22023';
  end if;
  if p_training_frequency is null or p_training_frequency not in
     ('4_plus','2_3','once','rarely_none') then
    raise exception 'Frequência de treino inválida' using errcode = '22023';
  end if;
  if p_age_range is null or p_age_range not in
     ('18_24','25_34','35_44','45_plus') then
    raise exception 'Faixa etária inválida' using errcode = '22023';
  end if;
  if p_decision_factor is null or p_decision_factor not in
     ('ingredients','price','taste','convenience') then
    raise exception 'Fator de decisão inválido' using errcode = '22023';
  end if;
  if p_price_range is null or p_price_range not in
     ('under_15','15_20','21_30','over_30') then
    raise exception 'Intervalo de preço inválido' using errcode = '22023';
  end if;

  insert into public.form_lab_responses (
    submission_id, product_interest, preferred_format, flavor,
    purchase_frequency, training_frequency, age_range, decision_factor, price_range
  ) values (
    p_submission_id, p_product_interest, p_preferred_format, p_flavor,
    p_purchase_frequency, p_training_frequency, p_age_range, p_decision_factor, p_price_range
  ) on conflict (submission_id) do nothing
  returning id into saved_id;

  -- Caso uma chamada chegue duas vezes (ex.: repetição por falha de rede),
  -- devolve o ID já gravado sem criar respostas duplicadas.
  if saved_id is null then
    select id into saved_id from public.form_lab_responses
    where submission_id = p_submission_id;
  end if;

  return saved_id;
end;
$$;

-- A função é o ÚNICO endpoint público de escrita desta solução.
revoke all on function public.submit_form_lab_response(
  uuid,text,text,text,text,text,text,text,text
) from public, anon, authenticated;
grant execute on function public.submit_form_lab_response(
  uuid,text,text,text,text,text,text,text,text
) to anon, authenticated;

-- Confirma depois de enviar um formulário no Supabase > SQL Editor:
-- select id, created_at, product_interest, preferred_format, price_range
-- from public.form_lab_responses order by id desc limit 10;
