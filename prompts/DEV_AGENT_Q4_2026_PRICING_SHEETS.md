# Dev Agent — Replace non-CoMedical pricing sheets with Q4 2026 PDFs

Ethan will paste this into a **new** agent chat. Implement in the Silq public website repo, then **deploy to production**. Ethan reviews on the live site.

You are a **dev agent**. Do the work. Do **not** change CoMedical pricing files, CoMedical download paths, or CoMedical button labels.

---

## Locked decisions (do not reopen)

1. **Overwrite** the three existing public URLs under `/pdfs/pricing/` (same filenames, new bytes).
2. **Do not** change CoMedical assets or links (`/pdfs/comedicalpricing/…`). Those reps keep the current PDFs.
3. Visible labels stay the same except **remove `(2026)`** from the **non-CoMedical** VA button only → `VA Facility Pricing Sheet`.
4. Copy the **current** non-CoMedical PDFs into `Webdev\archive\` for rollback **before** overwriting.
5. Deploy to **production** (`www.silq.tech`) after `npm run build` succeeds.

---

## System map

| Piece | Path / note |
|--------|-------------|
| Active site repo | `C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website` |
| Git remote | `https://github.com/Ethan-Rao/Silqtech.git` — branch **`main`** |
| Production | **`www.silq.tech`** — push to `main` auto-deploys (DigitalOcean App Platform). Apex `silq.tech` still Squarespace-redirects to `www`. |
| Q4 source folder (not in git) | `C:\Users\Ethan\OneDrive\Desktop\Webdev\Q4 2026 Pricing Sheets\` |
| Live standard pricing (replace these bytes) | `silq-website\public\pdfs\pricing\` |
| Live CoMedical pricing (**do not touch**) | `silq-website\public\pdfs\comedicalpricing\` |
| Download wiring | `src\app\rep\[slug]\page.tsx` — `standardPricingSheets` vs `comedicalPricingSheets` |

### Q4 source files (exact names)

| GPO | Source file | Size (bytes) |
|-----|-------------|--------------|
| Premier | `Silq Technologies - Premier Q42026 Price List (1).pdf` | 621,861 |
| Vizient | `Silq Technologies - Vizient Q42026 Price List.pdf` | 957,478 |
| VA | `Silq Technologies - VA Q42026 Price List.pdf` | 3,083,836 |

The Premier filename includes `(1)` — that is the **only** Premier file in the folder. Use it. Do not rename sources in the Q4 folder.

### Current live files to replace

| Public URL | Disk path | Current size (approx) |
|------------|-----------|------------------------|
| `/pdfs/pricing/premier-pricing.pdf` | `public\pdfs\pricing\premier-pricing.pdf` | 2,787,964 |
| `/pdfs/pricing/vizient-pricing.pdf` | `public\pdfs\pricing\vizient-pricing.pdf` | 2,774,912 |
| `/pdfs/pricing/va-pricing.pdf` | `public\pdfs\pricing\va-pricing.pdf` | 167,235 |

### CoMedical — leave 100% unchanged

`COMEDICAL_SLUGS` = `dowdy`, `dennehy`, `murray`, `hagarty`, `collins`

| Public URL | Disk path | Current size (approx) |
|------------|-----------|------------------------|
| `/pdfs/comedicalpricing/premier-pricing.pdf` | `public\pdfs\comedicalpricing\premier-pricing.pdf` | 3,041,502 |
| `/pdfs/comedicalpricing/vizient-pricing.pdf` | `public\pdfs\comedicalpricing\vizient-pricing.pdf` | 3,030,518 |
| `/pdfs/comedicalpricing/va-pricing.pdf` | `public\pdfs\comedicalpricing\va-pricing.pdf` | 10,834,398 |

Do **not** copy Q4 PDFs into `comedicalpricing/`. Do **not** edit the `comedicalPricingSheets` array.

---

## Work

1. **Archive** the three current `public\pdfs\pricing\*.pdf` files under:

   `C:\Users\Ethan\OneDrive\Desktop\Webdev\archive\`

   Use clear names, e.g. `premier-pricing-pre-q4-2026.pdf`, `vizient-pricing-pre-q4-2026.pdf`, `va-pricing-pre-q4-2026.pdf`. Do not add these archives to the git repo (archive is outside `silq-website`).

2. **Overwrite in place** (binary copy; keep filenames):

   - Q4 Premier `(1).pdf` → `public\pdfs\pricing\premier-pricing.pdf`
   - Q4 Vizient → `public\pdfs\pricing\vizient-pricing.pdf`
   - Q4 VA → `public\pdfs\pricing\va-pricing.pdf`

3. **Label only** in `src\app\rep\[slug]\page.tsx` `standardPricingSheets`:

   ```ts
   { name: 'VA Facility Pricing Sheet', path: '/pdfs/pricing/va-pricing.pdf' },
   ```

   Keep Premier / Vizient names and **all three paths** unchanged. Do not change `comedicalPricingSheets`.

4. Confirm SHA256 of each live `public\pdfs\pricing\*.pdf` matches its Q4 source. Confirm CoMedical SHA256/sizes are **unchanged**.

5. Optional: if `docs\IMAGE_AND_CONTENT_GUIDE.md` still says “VA facility pricing (2026 sheet)”, update that one line to match. Do not start a docs rewrite.

---

## Safety

1. PDF **paths must stay identical** for non-CoMedical and CoMedical.
2. Do not touch bifolds, IFU, testimonials, or other `public\pdfs\` files.
3. Do not mix unrelated working-tree changes (`docs/dev-prompts` deletions, funnel scripts, Facilities_All backfill, etc.) into this commit.
4. Do not change `C:\Users\Ethan\OneDrive\Desktop\CMSDataAnalysis`.
5. `npm run build` must succeed before deploy.

---

## Deploy & live verification

1. `npm run build` in `silq-website`.
2. Commit on `main` (only this task’s files) and push `origin/main`. Suggested message:

   ```
   Replace standard rep pricing sheets with Q4 2026 PDFs

   Overwrite /pdfs/pricing Premier, Vizient, and VA at existing URLs.
   Leave CoMedical sheets and paths unchanged. Drop (2026) from the
   standard VA download label.
   ```

3. Live checklist on **https://www.silq.tech** (HEAD/GET; wait for DigitalOcean if needed):

   - [ ] `/pdfs/pricing/premier-pricing.pdf` size **621,861** (or SHA256 match to Q4 Premier)
   - [ ] `/pdfs/pricing/vizient-pricing.pdf` size **957,478**
   - [ ] `/pdfs/pricing/va-pricing.pdf` size **3,083,836**
   - [ ] `/pdfs/comedicalpricing/premier-pricing.pdf` still **~3,041,502** (unchanged)
   - [ ] `/pdfs/comedicalpricing/vizient-pricing.pdf` still **~3,030,518**
   - [ ] `/pdfs/comedicalpricing/va-pricing.pdf` still **~10,834,398**
   - [ ] A **standard** rep page (e.g. `/klea`) still links to `/pdfs/pricing/…`; VA label is `VA Facility Pricing Sheet` (no `(2026)`). Page 200.
   - [ ] A **CoMedical** page (e.g. `/comedical/dowdy`) still links to `/pdfs/comedicalpricing/…` and still 200.
   - [ ] `/kleamedical` still redirects to `/klea`; `/genesis` still 404 (do not regress prior roster work).

---

## Out of scope

- CoMedical pricing PDFs, paths, or labels
- New public URL names (`*-q4-2026.pdf` etc.)
- Facilities_All map backfill
- Roster / Genesis / Paul Wilson changes
- Regenerating rep JSON

---

## First commands

```text
Get-ChildItem -LiteralPath "C:\Users\Ethan\OneDrive\Desktop\Webdev\Q4 2026 Pricing Sheets"
Get-FileHash "C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website\public\pdfs\pricing\*.pdf"
Get-FileHash "C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website\public\pdfs\comedicalpricing\*.pdf"
```
