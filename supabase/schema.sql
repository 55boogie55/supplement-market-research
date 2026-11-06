-- FORM / LAB — esquema inicial do estudo de mercado
-- Executa este ficheiro no SQL Editor do teu projeto Supabase.
-- Não recolhemos nome, email ou informação clínica.

create table if not exists public.market_survey_responses (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  product_interest text not null check (product_interest in ('protein_gummies', 'creatine_gummies', 'ashwagandha', 'daily_gummies', 'other')),
  preferred_format text not null check (preferred_format in ('gummies', 'powder', 'capsules', 'drink')),
  price_range text not null check (price_range in ('under_15', '15_20', '21_25', '26_30', 'over_30')),
  purchase_frequency text not null check (purchase_frequency in ('monthly', 'every_2_3_months', 'when_needed', 'not_yet')),
  training_frequency text not null check (training_frequency in ('4_plus', '2_3', 'once', 'rarely_none')),
  age_range text not null check (age_range in ('18_24', '25_34', '35_44', '45_54', '55_plus')),
  flavor text not null check (flavor in ('fruit', 'berries', 'citrus', 'neutral', 'no_preference')),
  decision_factor text not null check (decision_factor in ('ingredients', 'price', 'taste', 'convenience', 'brand_trust'))
);

-- A tabela não fica diretamente acessível através da API pública.
-- As respostas são submetidas e os resultados são consultados através de funções controladas.
alter table public.market_survey_responses enable row level security;
revoke all on table public.market_survey_responses from anon, authenticated;

create or replace function public.submit_survey_response(
  p_product_interest text,
  p_preferred_format text,
  p_price_range text,
  p_purchase_frequency text,
  p_training_frequency text,
  p_age_range text,
  p_flavor text,
  p_decision_factor text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_product_interest is null or p_product_interest not in ('protein_gummies', 'creatine_gummies', 'ashwagandha', 'daily_gummies', 'other') then
    raise exception 'Invalid product choice';
  end if;
  if p_preferred_format is null or p_preferred_format not in ('gummies', 'powder', 'capsules', 'drink') then
    raise exception 'Invalid format choice';
  end if;
  if p_price_range is null or p_price_range not in ('under_15', '15_20', '21_25', '26_30', 'over_30') then
    raise exception 'Invalid price choice';
  end if;
  if p_purchase_frequency is null or p_purchase_frequency not in ('monthly', 'every_2_3_months', 'when_needed', 'not_yet') then
    raise exception 'Invalid purchase frequency';
  end if;
  if p_training_frequency is null or p_training_frequency not in ('4_plus', '2_3', 'once', 'rarely_none') then
    raise exception 'Invalid training frequency';
  end if;
  if p_age_range is null or p_age_range not in ('18_24', '25_34', '35_44', '45_54', '55_plus') then
    raise exception 'Invalid age range';
  end if;
  if p_flavor is null or p_flavor not in ('fruit', 'berries', 'citrus', 'neutral', 'no_preference') then
    raise exception 'Invalid flavor';
  end if;
  if p_decision_factor is null or p_decision_factor not in ('ingredients', 'price', 'taste', 'convenience', 'brand_trust') then
    raise exception 'Invalid decision factor';
  end if;

  insert into public.market_survey_responses (
    product_interest,
    preferred_format,
    price_range,
    purchase_frequency,
    training_frequency,
    age_range,
    flavor,
    decision_factor
  ) values (
    p_product_interest,
    p_preferred_format,
    p_price_range,
    p_purchase_frequency,
    p_training_frequency,
    p_age_range,
    p_flavor,
    p_decision_factor
  );
end;
$$;

create or replace function public.get_survey_results()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'total', (select count(*) from public.market_survey_responses),
    'products', coalesce((
      select jsonb_agg(jsonb_build_object('label', product_interest, 'count', amount) order by amount desc)
      from (select product_interest, count(*)::integer as amount from public.market_survey_responses group by product_interest) grouped_products
    ), '[]'::jsonb),
    'formats', coalesce((
      select jsonb_agg(jsonb_build_object('label', preferred_format, 'count', amount) order by amount desc)
      from (select preferred_format, count(*)::integer as amount from public.market_survey_responses group by preferred_format) grouped_formats
    ), '[]'::jsonb),
    'prices', coalesce((
      select jsonb_agg(jsonb_build_object('label', price_range, 'count', amount) order by amount desc)
      from (select price_range, count(*)::integer as amount from public.market_survey_responses group by price_range) grouped_prices
    ), '[]'::jsonb)
  );
$$;

-- As funções são os únicos pontos de entrada públicos para este estudo.
revoke all on function public.submit_survey_response(text, text, text, text, text, text, text, text) from public;
revoke all on function public.get_survey_results() from public;
grant execute on function public.submit_survey_response(text, text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.get_survey_results() to anon, authenticated;
