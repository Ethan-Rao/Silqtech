# NuSilq Dashboard — BM7.9 Data Update + Routing Fix Agent Prompt

## Role
You are a dev agent for the Silq Technologies website. Your task is:
1. Update `public/data/nusilq/projects.json` with changes from the BM7.9 Excel file
2. Fix the `/nusilq` routing issue in `next.config.js`
3. Build, commit, and deploy

**Do NOT auto-generate the JSON from the Excel script.** Make all changes as surgical JSON edits to preserve existing `notes[]` arrays and stable `id` values.

---

## Repository Context
- **Repo:** `c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website`
- **New Excel:** `NuSilq/Silq-NuSil ongoing projects Offline_BM7.9.xlsx` (already copied into repo)
- **Previous Excel for reference:** `NuSilq/Silq-NuSil ongoing projects Offline_BM6.17.xlsx`
- **Live data file:** `public/data/nusilq/projects.json`
- **Deploy:** `git push` to `main` → DigitalOcean auto-deploys to `silq.tech`

---

## Data Architecture Reminder
- `public/data/nusilq/projects.json` is the BASE layer. `notes[]` arrays inside it are the seed notes visible to all users.
- Team members' browser-added notes live in `localStorage` under key `nusilq-notes-overlay` — these are never in the JSON file and are never touched by your edits.
- **Never change a company's `id` field once it exists** — it would break localStorage overlay lookups.
- Always set `notes: []` on NEW entries (no pre-seeded notes unless specified below).

---

## ⚠️ Note on Browser-Saved Notes (localStorage)

Team members add notes directly in the dashboard browser UI. These are stored in `localStorage` under the key `nusilq-notes-overlay` on each person's device and are **not** in `projects.json`. The agent cannot see them.

**This update does NOT account for those notes.** Any notes added by team members in the browser are safe — they live in a separate layer and are unaffected by edits to `projects.json`. However, for entries being **removed or moved** in this update (GC Aesthetics, J&J, Aspero Medical, BMC), any browser-side notes on those entries may become orphaned.

For how to handle this properly in future updates, see the master update prompt (`DEV_AGENT_NUSILQ_UPDATE_PROMPT.md`), which now includes a Step 0 pre-export process.

---

## Part 1 — Changes to `public/data/nusilq/projects.json`

Read the full current file first. Then make ALL of the following edits.

---

### ONGOING PROJECTS — changes

#### 1. INSERT 4 brand-new entries at the TOP of the `ongoing[]` array (positions 0–3)

These companies are new in BM7.9 and do not exist anywhere in the current JSON.

**Position 0 — Medicone**
```json
{
  "id": "medicone",
  "companyName": "Medicone",
  "currentActionItem": "Valerie sent tNDA for signature 6/29/26",
  "projectStatus": "",
  "tNDA": "",
  "lastUpdated": "2026-07-09",
  "applicationDescription": "",
  "notes": []
}
```

**Position 1 — Alcon**
```json
{
  "id": "alcon",
  "companyName": "Alcon",
  "currentActionItem": "Introductory meeting 5/28/26",
  "projectStatus": "Valerie sent tNDA for review on 7/8/26",
  "tNDA": "",
  "lastUpdated": "2026-07-09",
  "applicationDescription": "",
  "notes": []
}
```

**Position 2 — Promed/Liquid Medical**
```json
{
  "id": "promed-liquid-medical",
  "companyName": "Promed/Liquid Medical",
  "currentActionItem": "Introductory meeting 6/25/26",
  "projectStatus": "Jan Koscielniak requested mNDA and samples on 6/25/26",
  "tNDA": "",
  "lastUpdated": "2026-07-09",
  "applicationDescription": "Glaucoma Implants",
  "notes": []
}
```

**Position 3 — Stedical Scientific**
```json
{
  "id": "stedical-scientific",
  "companyName": "Stedical Scientific",
  "currentActionItem": "Introductory meeting 6/23/26",
  "projectStatus": "",
  "tNDA": "",
  "lastUpdated": "2026-07-09",
  "applicationDescription": "",
  "notes": []
}
```

#### 2. INSERT Liqid Medical at position 4 (after the 4 new entries above, before Aspero)

This company appeared in the BM6.26 Excel but was never applied to the live site. It is now confirmed in BM7.9.
```json
{
  "id": "liqid-medical",
  "companyName": "Liqid Medical",
  "currentActionItem": "Silq to approve of sharing samples",
  "projectStatus": "Initial Meeting 6/26",
  "tNDA": "",
  "lastUpdated": "2026-06-26",
  "applicationDescription": "Glaucoma Implants",
  "notes": []
}
```

#### 3. UPDATE BMC Health `projectStatus`
Find the entry with `"id": "bmc-health"`. Change the `projectStatus` field:
- **Old:** `"Feasibility Complete, samples remain"`
- **New:** `"Evaluation Phase Pending agreement"`

Also add a seed note recording the previous status (this preserves history from BM6.17):
```json
{
  "id": "note-bmc-health-bm617",
  "timestamp": "2026-07-09T00:00:00.000Z",
  "author": "BM6.17 history",
  "text": "Previous project status (as of BM6.17): Feasibility Complete, samples remain"
}
```
Add this to the `notes[]` array of the `bmc-health` entry.

#### 4. REMOVE GC Aesthetics from `ongoing[]`
Find and delete the entire entry with `"id": "gc-aesthetics"` from the `ongoing[]` array. It is moving to `stalled[]` (see below). Preserve its data before deleting — you'll need it for the stalled entry.

---

### ACTIVE TARGETS — changes

#### 5. REMOVE J&J from `targets[]`
Find and delete the entry with `"id": "j-j"` from the `targets[]` array. It is moving to `stalled[]`.
This entry has a seed note: `"text": "Baerveldt nonvalved Implant J&J"` — preserve this text for the stalled entry below.

#### 6. REMOVE Aspero Medical from `targets[]`
Find and delete the entry with `"id": "aspero-medical"` from the `targets[]` array. It does not appear in BM7.9 at all and is fully removed.

#### 7. REMOVE BMC from `targets[]`
Find and delete the entry with `"id": "bmc"` from the `targets[]` array (this is the generic "BMC" target, distinct from "BMC Health" in ongoing). It does not appear in BM7.9 targets.

---

### CURRENTLY STALLED — changes

#### 8. ADD J&J to `stalled[]` (APPEND at end)
J&J moves from Active Targets to Stalled. Use the existing seed note text as the `projectStatus`:
```json
{
  "id": "j-j",
  "companyName": "J&J",
  "projectStatus": "Baerveldt nonvalved Implant J&J",
  "applicationDescription": "glaucoma implants",
  "lastContact": "2025-09-12",
  "notes": [
    {
      "id": "note-j-j-moved",
      "timestamp": "2026-07-09T00:00:00.000Z",
      "author": "BM7.9 update",
      "text": "Moved from Active Targets. Previously tracked as a glaucoma implant prospect (Baerveldt nonvalved Implant)."
    }
  ]
}
```

#### 9. ADD GC Aesthetics to `stalled[]` (APPEND after J&J)
GC Aesthetics moves from Ongoing to Stalled. Capture its last known ongoing data as a seed note:
```json
{
  "id": "gc-aesthetics",
  "companyName": "GC Aesthetics",
  "projectStatus": "GC to Review Proposal. Feasibility quote sent with biological testing. Signed tNDA",
  "applicationDescription": "Breast Implants",
  "lastContact": null,
  "notes": [
    {
      "id": "note-gc-aesthetics-moved",
      "timestamp": "2026-07-09T00:00:00.000Z",
      "author": "BM7.9 update",
      "text": "Moved from Ongoing Projects. Last active status: Feasibility quote sent with biological testing (tNDA signed). Action item was: GC to Review Proposal."
    }
  ]
}
```

---

### Verify unchanged sections
All other entries across `ongoing[]`, `targets[]`, and `stalled[]` should be left exactly as they are in the current file. Do not reorder, reformat, or modify any entry not listed above.

Update the top-level `"generated"` timestamp to `"2026-07-09T00:00:00.000Z"`.

---

## Part 2 — Routing Fix in `next.config.js`

Two issues to fix:

### Fix A — Add `/nusil` → `/nusilq` redirect
The user navigates to `silq.tech/nusil` (without the 'q') and expects to reach the NuSilq dashboard. Add a redirect so this works.

In the `redirects()` array in `next.config.js`, add this entry **at the very top** of the return array (before all other redirects):
```js
{ source: '/nusil', destination: '/nusilq', permanent: false },
```

### Fix B — Prevent CDN from caching `/nusilq` responses
The user reports that navigating to the URL shows the homepage on first visit, but works on retry. This is the same client-side RSC (React Server Component) payload caching issue that affects static Next.js pages when a CDN has cached a stale response for the route.

Add a `headers()` function to `next.config.js` to emit `Cache-Control: no-store` for the `/nusilq` route, preventing CDN caching without changing the page to dynamic server rendering:

```js
async headers() {
  return [
    {
      source: '/nusilq',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, must-revalidate',
        },
      ],
    },
  ]
},
```

Add this `headers()` function to the `nextConfig` object in `next.config.js`, alongside the existing `rewrites()` and `redirects()` functions (order doesn't matter, but add it before `rewrites` for clarity).

---

## Part 3 — Build, Commit, Deploy

```bash
# 1. Confirm build passes
npm run build

# 2. Stage changes
git add public/data/nusilq/projects.json next.config.js NuSilq/

# 3. Commit
git commit -m "data: update NuSilq dashboard BM7.9 (4 new ongoing, 3 target removals, 2 moved to stalled) + routing fix"

# 4. Push to trigger DigitalOcean auto-deploy
git push
```

The live site (`silq.tech/nusilq`) will reflect changes within ~5 minutes of the push. The new `/nusil` redirect will also be live after deployment.

---

## Summary of All Changes (quick reference)

| Section | Change | Company |
|---|---|---|
| Ongoing | ➕ NEW | Medicone |
| Ongoing | ➕ NEW | Alcon |
| Ongoing | ➕ NEW | Promed/Liquid Medical |
| Ongoing | ➕ NEW | Stedical Scientific |
| Ongoing | ➕ NEW | Liqid Medical (from BM6.26, now confirmed) |
| Ongoing | ✏️ UPDATED | BMC Health — projectStatus + history note |
| Ongoing | ➡️ MOVED to Stalled | GC Aesthetics |
| Targets | ➡️ MOVED to Stalled | J&J |
| Targets | ❌ REMOVED | Aspero Medical |
| Targets | ❌ REMOVED | BMC |
| Stalled | ➕ NEW (from Targets) | J&J |
| Stalled | ➕ NEW (from Ongoing) | GC Aesthetics |
| Routing | 🔧 FIX | /nusil → /nusilq redirect |
| Routing | 🔧 FIX | Cache-Control: no-store for /nusilq |
