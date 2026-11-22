# ORVAE V8 — Maçã

Esta versão mantém as 8 opções de suplementos e troca apenas o sabor **Baunilha** por **Maçã**.

Também mantém as tuas alterações textuais: **A escolha é tua** (sem Edição 001) e **Escolhe uma opção para continuar.**

## Instalação

1. Na pasta clonada do GitHub (`form-lab-publicar`), substitui o `index.html` pela versão deste ZIP.
2. Copia **`assets/flavor-maca.webp`** para a pasta `assets/` existente. As outras imagens são iguais à V7. O ZIP também as inclui caso precises.
3. Podes eliminar `assets/flavor-baunilha.png` — já não é usado.
4. Abre o Supabase → **SQL Editor** e executa o conteúdo de **`supabase-atualizar-maca.sql`**. Isto é necessário porque a função e a tabela antigas rejeitam o novo sabor `maca`. Esta atualização também autoriza `melatonina`, que foi adicionada na V7, e mantém todos os votos anteriores.
5. Faz push da pasta clonada:

```powershell
git add -A
git commit -m "Orvae V8 - trocar baunilha por maca"
git push origin main
```

6. Após o GitHub Pages atualizar, testa Maçã e confirma em Supabase → SQL Editor:

```sql
SELECT supplement, flavor, created_at
FROM public.orvae_votes
ORDER BY created_at DESC
LIMIT 10;
```

O site continua a ser um único `index.html`. Apenas a página muda; a tabela existente não é recriada nem os votos anteriores apagados.
