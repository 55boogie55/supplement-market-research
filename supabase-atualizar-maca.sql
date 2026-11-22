-- ORVAE V8 - permitir sabor maca e suplemento melatonina.
-- Executar UMA vez no SQL Editor do Supabase existente.
-- Preserva todos os votos atuais (incluindo sabores antigos) e nao apaga tabelas.
BEGIN;

ALTER TABLE public.orvae_votes
  DROP CONSTRAINT IF EXISTS orvae_votes_flavor_check;
ALTER TABLE public.orvae_votes
  ADD CONSTRAINT orvae_votes_flavor_check CHECK (flavor IN (
    'mirtilo','frutos_vermelhos','laranja','limao','morango','manga','maracuja','melancia',
    'chocolate','cookie','baunilha','sem_sabor','maca'
  ));

ALTER TABLE public.orvae_votes
  DROP CONSTRAINT IF EXISTS orvae_votes_supplement_check;
ALTER TABLE public.orvae_votes
  ADD CONSTRAINT orvae_votes_supplement_check CHECK (supplement IN (
    'creatina','proteina','multivitaminico','magnesio','omega_3','colagenio','vitamina_d',
    'ashwagandha','melatonina'
  ));

CREATE OR REPLACE FUNCTION public.submit_orvae_vote(
  p_supplement text,
  p_flavor text,
  p_submission_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_submission_id IS NULL OR
     p_supplement IS NULL OR p_supplement NOT IN (
       'creatina','proteina','multivitaminico','magnesio','omega_3','colagenio',
       'vitamina_d','ashwagandha','melatonina'
     ) OR p_flavor IS NULL OR p_flavor NOT IN (
       'mirtilo','frutos_vermelhos','laranja','limao','morango','manga','maracuja',
       'melancia','chocolate','cookie','baunilha','sem_sabor','maca'
     ) THEN
    RAISE EXCEPTION 'Escolha inválida' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.orvae_votes(submission_id, supplement, flavor)
  VALUES (p_submission_id, p_supplement, p_flavor)
  ON CONFLICT (submission_id) DO NOTHING;
  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_orvae_vote(text,text,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_orvae_vote(text,text,uuid) TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
