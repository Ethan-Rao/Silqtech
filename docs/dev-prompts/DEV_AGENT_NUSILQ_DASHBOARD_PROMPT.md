# Dev Agent Prompt: NuSilq Project Management Dashboard (`/nusilq`)

---

## Role and goal

You are building a **password-protected internal project management dashboard** at `/nusilq` on the existing Silq Technologies Next.js 14 App Router site (`silq-website`). This is an internal tool for the Silq team to track 20–30 active commercial partnerships with other companies. You will touch only the files needed for this feature; do not modify any existing pages, components, routes, or configuration unrelated to this dashboard.

---

## Repository context

- **Stack:** Next.js 14.2, TypeScript, Tailwind CSS, Framer Motion, `react-hook-form`, `zod`. No database currently.
- **Auth pattern:** Existing `src/components/ui/PasswordGate.tsx` — client component, stores authentication in `sessionStorage`, hardcoded password constant at the top of the file. Used on `/rep`.
- **Styling:** Tailwind with the Silq brand token set (`silq-blue` `#314780`, `silq-teal` `#00ADEF`, `silq-dark` `#0E1216`, `silq-cream` `#F8F7F4`, `silq-light` `#EBEAE3`). Match the existing design language.
- **Deploy target:** DigitalOcean App Platform, branch `main`, auto-deploys on push.
- **Source Excel:** `NuSilq/Silq-NuSil ongoing projects Offline.xlsx` (in the workspace root, **outside** `silq-website/`). Copy it into `silq-website/NuSilq/` so it is tracked in the repo and available at build time.

---

## URL and access

- **Route:** `src/app/nusilq/page.tsx` → served at `https://www.silq.tech/nusilq`
- **Password:** `Nusil!Silq2026`
- **Auth mechanism:** Create a new `PasswordGate`-style component — **do not modify** `PasswordGate.tsx` (that is the `/rep` gate with its own password and session key). Create `src/components/ui/NusilqPasswordGate.tsx` that is structurally identical but uses:
  - Password constant: `Nusil!Silq2026`
  - Session storage key: `nusilq-auth`
  - Header text: `NuSilq Dashboard`
  - Sub-text: `Authorized team members only`

---

## Data architecture

### Source of truth for classification (which section each project belongs in)

The Excel file has **three sheets** — each sheet maps directly to one dashboard section:

| Excel Sheet | Dashboard Section |
|---|---|
| `Ongoing Projects` | **Ongoing Projects** (main / left) |
| `Potential Targets` | **Active Targets** (right sidebar) |
| `Currently Stalled Projects` | **Stalled Projects** (bottom) |

### Step 1 — Excel → JSON seed data (build script)

Create **`silq-website/scripts/generate-nusilq-data.mjs`** using the `xlsx` package (already a dev dependency after previous work, or install it: `npm install -D xlsx`).

The script should:
1. Read `silq-website/NuSilq/Silq-NuSil ongoing projects Offline.xlsx`
2. Output **`silq-website/public/data/nusilq/projects.json`** — a single JSON object with keys `ongoing`, `targets`, `stalled`, each an array of project objects (see schemas below)
3. Convert Excel serial date numbers (e.g. `46182`) to ISO date strings using `XLSX.SSF.parse_date_code` or simple epoch math: `new Date(Date.UTC(1899, 11, 30) + serialDate * 86400000).toISOString().slice(0, 10)`. If the cell is already a string date or empty, pass it through or store `null`.
4. Drop the `__EMPTY` column.
5. Add a `"generated"` timestamp key at the root.

Add the script to `package.json` scripts:

```json
"build:nusilq-data": "node scripts/generate-nusilq-data.mjs"
```

**Run the script** before committing so `public/data/nusilq/projects.json` is present in the repo and DO serves it as a static asset.

### Project JSON schemas

**Ongoing Projects** (from sheet `Ongoing Projects`):
```ts
{
  id: string,              // slugified Company Name, e.g. "aspero"
  companyName: string,     // "Company Name"
  currentActionItem: string,   // "Current Action Item"
  projectStatus: string,   // "Project Status"
  tNDA: string,            // "tNDA"
  lastUpdated: string | null,  // "Last Update made" — ISO date string or null
  applicationDescription: string, // "Application Description"
  notes: NoteEntry[]       // starts empty; filled by in-app edits (see below)
}
```

**Active Targets** (from sheet `Potential Targets`):
```ts
{
  id: string,              // slugified Company
  companyName: string,     // "Company"
  application: string,     // "Application"
  deviceDetails: string,   // "Device Details"
  notes: NoteEntry[]       // "Notes" column seeded as first note entry; plus in-app edits
}
```

**Stalled Projects** (from sheet `Currently Stalled Projects`):
```ts
{
  id: string,              // slugified Company Name
  companyName: string,     // "Company Name"
  projectStatus: string,   // "Project Status"
  applicationDescription: string, // "Application Description"
  lastContact: string | null,  // "Last Contact Date" — ISO date string or null
  notes: NoteEntry[]       // starts empty; in-app edits added here
}
```

**NoteEntry:**
```ts
{
  id: string,           // uuid or timestamp string
  timestamp: string,    // ISO datetime
  author: string,       // free text entered by user
  text: string
}
```

### Step 2 — Persistent in-app notes (overlay layer)

Team members need to add notes/updates that are **not** in the Excel and must **persist across sessions and devices**.

**Recommended approach — localStorage overlay (simple, no infra needed):**

Store all in-app edits in `localStorage` under the key `nusilq-notes-overlay` as a JSON object:

```json
{
  "aspero": [{ "id": "...", "timestamp": "...", "author": "...", "text": "..." }],
  "ab": [...]
}
```

On load: merge the `public/data/nusilq/projects.json` base data with the overlay from `localStorage`. Notes from the overlay are stored separately so a future Excel regeneration never wipes them.

**Limitation to document in a comment:** `localStorage` is per-browser per-device. If the team needs cross-device sync in the future, migrate to a simple API route writing to a persistent volume or a lightweight DB. For now, `localStorage` is acceptable for a small internal team and requires zero backend changes.

---

## Existing data (pre-populate the JSON correctly)

Below is the full data from the Excel for reference. The build script will generate this, but include it here so you can verify the script output.

### Ongoing Projects (15 rows)
```
Aspero | Testing Silq Treated Samples | Performance Testing | Signed | 2026-06-16 | Endoscope Tubing
AB | Silq Performing Electrochemical Testing | Electrochemical analysis, performance testing starting Q3 | Signed | 2026-06-09 | Cochlear Implants
BMC Health | Regulatory Discussions | Feasibility Complete, samples remain | Signed 2/16/26 | 2026-06-08 | Penile Implant
Medtronic | MTA In Development | Initiated | (none) | 2026-06-08 | Hydrocephalus Shunt
Boston Scientific (Ireland) | NDA in Development | Initiated | (none) | 2026-06-08 | Urology Device
Establishment Labs | Nusil to Coordinate TNDA | Very interested, but cash constrained | (none) | 2025-09-01 | Breast Implants
Abbott | Silq to treat 20cm Samples and invoice work | (none) | Signed | 2025-08-25 | (none)
Med-El | Eugiene to follow up upon return | Pre-NDA Samples Sent 8.12.25 | (none) | 2025-08-04 | (none)
GC Aesthetics | GC to Review Proposal | Feasibility quote sent with biological testing | Signed | 2025-07-06 | Breast Implants
Todoc | (none) | Todoc are evaluating their resource availability | Sent June 9 '25 | 2025-06-25 | Cochlear Implants
Silimed | NDA under review | Meeting with distributor in Brazil | (none) | 2025-06-25 | (none)
Abbvie | Project transitioning to Costa Rica team | 3-way NDA signed 6/30/25 | Signed | 2025-06-24 | Tissue Expander Component
Sophysa | (none) | Awaiting decision on NDA/TNDA signature | (none) | 2025-02-03 | Hydrocephalus Shunt
Gulf Rubber | (none) | Awaiting Nusil follow up on introductory call | Signed | 2025-01-31 | (none)
Pelican Health | (none) | NDA Sent | (none) | null | Digestive sampling device
```

### Stalled Projects (20 rows)
```
Procope Medicals | project stalled due to other priorities | total artificial heart | 2025-03-10
Mitka | (none) | (none) | null
BSC (via Nusil) | (none) | (none) | null
J&J (via Nusil) | (none) | (none) | null
Edwards Life Sciences | (none) | (none) | null
Luna | (none) | (none) | null
Newronika | quote was sent to them but fell through | (none) | 2024-10-28
Becton Dickenson | (none) | (none) | null
Perikinetics | Focused on alternative design priority | artificial pancreas for insulin therapy | 2021-10-27
Nurotron | last discussed feasibility testing on coated electrodes | Cochlear Device | 2022-05-26
Freudenberg (inhealth) | (none) | Voice Prosthesis | null
Microport | Not seeking novel technology | Pacemaker | 2023-11-25
MED-EL | not seeking new filing of devices yet | cochlear devices | 2025-06-17
Polytech | were not interested when contacted | BIs | 2024-06-30
Vygon | Decided not to pursue | Catheters | 2025-04-21
Tingo | (none) | (none) | null
Cochlear Australia | Brian provided ASTM Test Results | Cochlear Implants | 2025-03-03
Next Step/Visionair | Simulated Mucus received 3/12 | Signed | 2025-03-25
HPBio | Customer decided to stay with method of dipping | (none) | 2026-03-28
New World | Pricing discussion 9/30/25 | Glaucoma Treatment Drain | 2025-08-25
```

### Active Targets (18 rows)
```
J&J | glaucoma implants | Silicone device includes holes to allow fibrous tissue growth | Baerveldt nonvalved Implant J&J
Glaukos Corp. | glaucoma implants | (none) | (none)
Myra Medical | glaucoma implants | (none) | (none)
HPBio (Brazil) | (none) | Neurosurgical (Drains, shunts), Gastroenterology | Looking to schedule call in Nov.
LifeSil (Brazil) | Breast Implants | (none) | Looking to schedule call.
FCI (France) | Ocular | (none) | (none)
Aspero Medical | Endoscopic | (none) | They have not made a decision yet. Need to follow up.
Ventura Biomedica | Hydrocephalous | ventricular catheters | Scheduling call
Kerecis | Wound management | Fish skin based skingrafts | Scheduling call
Cirtec | Various | Catheters and various other HC/MI devices | Intro call on 2/12/26
BMC | Penile implant | (none) | Meeting at MD&M. Call on 2/12/26
Nexsilis | (none) | (none) | (none)
Medicone | (none) | (none) | (none)
Silimed | (none) | (none) | (none)
FAJ | (none) | (none) | (none)
IBEG | (none) | (none) | (none)
Gabisa | (none) | (none) | (none)
Faga Medical | Breast Implants | Breast implant with PU foam section | (none)
```

---

## Dashboard layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "NuSilq Dashboard"  +  Silq logo  +  Search/filter │
├────────────────────────────────────┬────────────────────────┤
│  ONGOING PROJECTS (main, ~65% w)   │  ACTIVE TARGETS        │
│                                    │  (sidebar, ~35% w)     │
│  [Cards — see spec below]          │  [Cards]               │
│                                    │                        │
├────────────────────────────────────┴────────────────────────┤
│  STALLED PROJECTS (full width, bottom)                      │
│  [Cards]                                                    │
└─────────────────────────────────────────────────────────────┘
```

On mobile, all three sections stack vertically: Ongoing → Active Targets → Stalled.

---

## Card design

### Collapsed card (default state)
Each card shows:
- **Company name** — bold, large, `text-silq-dark`
- **Application Description** (or Application for Targets) — secondary text
- **Current Action Item / Project Status** — a short pill or text block, `text-silq-blue`
- **Last Updated** — formatted as e.g. `Jun 16 2026`, right-aligned; show `—` if null
- **Expand button** — chevron down icon, right side, full card is clickable to expand

Card color / accent:
- Ongoing: white card with `border-l-4 border-silq-blue`
- Active Targets: white card with `border-l-4 border-silq-teal`
- Stalled: white card with `border-l-4 border-silq-dark/30` (muted)

### Expanded card (on click)
Smoothly expand (Framer Motion `AnimatePresence`) to show:
- All fields from the project schema displayed as labeled rows
- **tNDA status** (Ongoing only) shown as a badge: green `Signed` / yellow `Pending` / gray `—`
- **Notes timeline** — chronological list of `NoteEntry` items. Each note shows timestamp, author name, and text. Excel seed notes (from `Notes` column in Targets) displayed as the first entry with author `"Excel import"`.
- **"Add Note" inline form** — two fields: `Author` (text, required) and `Note` (textarea, min 5 chars). Submit saves to `localStorage` overlay immediately and re-renders. No page reload.
- A subtle **"Edit base info"** button that opens an inline edit form for the structured fields (companyName, currentActionItem, projectStatus, applicationDescription, tNDA, lastUpdated). Edits saved to `localStorage` overlay. Display a small `✎ edited` badge on the card if base info has been overridden locally.

---

## State management and data flow

```
1. Page loads → fetch('/data/nusilq/projects.json')
2. Read localStorage key 'nusilq-notes-overlay'
3. Merge: overlay notes appended to base notes; overlay base-info edits override base fields
4. Render three sections from merged data
5. On "Add Note" submit → append to overlay → update state → re-render card
6. On "Edit base info" submit → store override in overlay → update state → re-render card
```

Use React `useState` for the merged project list. No external state library needed.

---

## Additional UI features

- **Search bar** (top of dashboard): filters all three sections simultaneously by company name (case-insensitive).
- **"Add New Project" button** per section: opens a modal or inline form to create a brand-new project card (stored only in `localStorage` overlay with a flag `"source": "manual"`). Fields match the section's schema; company name required.
- **Export JSON button** (top right, subtle): downloads the full merged state as a `.json` file so the team can back up or migrate notes.
- **"Last synced from Excel"** label showing the `generated` timestamp from `projects.json`.
- Section counts in section headers: e.g. `Ongoing Projects (15)`.

---

## File structure to create

```
silq-website/
├── NuSilq/
│   └── Silq-NuSil ongoing projects Offline.xlsx   ← copy from workspace root
├── scripts/
│   └── generate-nusilq-data.mjs                   ← NEW
├── public/data/nusilq/
│   └── projects.json                              ← generated by script
└── src/
    ├── app/
    │   └── nusilq/
    │       └── page.tsx                           ← NEW (password gate + dashboard)
    └── components/
        └── ui/
            └── NusilqPasswordGate.tsx             ← NEW
```

You may split the dashboard into sub-components as you see fit (e.g. `NusilqDashboard.tsx`, `ProjectCard.tsx`, `AddNoteForm.tsx`). Keep all NuSilq components in `src/components/nusilq/` if you create more than two.

---

## Constraints and things NOT to change

- Do **not** modify `PasswordGate.tsx`, `next.config.js`, `robots.ts`, `sitemap.xml/route.ts`, or any existing page.
- Do **not** add new npm dependencies beyond `xlsx` (if not already present) and any that are strictly required and unavoidable.
- The Excel file at `silq-website/NuSilq/` is the classification source of truth. When the user updates the Excel and re-runs `npm run build:nusilq-data`, the JSON regenerates and section membership changes. In-app overlay notes keyed by company ID are preserved across regenerations.
- The page must be excluded from the public sitemap and crawlers. Add `export const metadata` with `robots: { index: false, follow: false }` in `src/app/nusilq/page.tsx`.

---

## TypeScript and quality requirements

- Strict TypeScript throughout. No `any` types unless genuinely unavoidable.
- No linter errors (`next lint` must pass).
- `npm run build` must succeed before committing.

---

## Deployment instructions (for automatic DO deploy)

1. **Copy the Excel** into `silq-website/NuSilq/Silq-NuSil ongoing projects Offline.xlsx`.
2. **Run** `npm run build:nusilq-data` from inside `silq-website/` to generate `public/data/nusilq/projects.json`.
3. **Run** `npm run build` to confirm zero errors.
4. **Stage and commit** all new and modified files:
   ```bash
   git add NuSilq/ scripts/generate-nusilq-data.mjs public/data/nusilq/ \
           src/app/nusilq/ src/components/ui/NusilqPasswordGate.tsx \
           src/components/nusilq/ package.json
   git commit -m "Add NuSilq internal project management dashboard at /nusilq"
   git push origin main
   ```
5. DigitalOcean App Platform is configured to **auto-deploy on push to `main`**. After the push, monitor the DO build log; expect a successful deploy within ~2 minutes.
6. After deploy, visit **`https://www.silq.tech/nusilq`**, enter password `Nusil!Silq2026`, and verify all three sections load with the correct project counts:
   - Ongoing Projects: 15 cards
   - Active Targets: 18 cards
   - Stalled Projects: 20 cards

---

## Deliverable checklist

- [ ] `silq-website/NuSilq/` Excel file copied and tracked in git
- [ ] `scripts/generate-nusilq-data.mjs` working script
- [ ] `public/data/nusilq/projects.json` generated and committed
- [ ] `src/components/ui/NusilqPasswordGate.tsx` — standalone gate, no changes to existing PasswordGate
- [ ] `src/app/nusilq/page.tsx` — password-gated dashboard, `noindex` metadata
- [ ] All three sections render from JSON with correct counts
- [ ] Cards expand/collapse with animation
- [ ] Add Note inline form saves to localStorage and re-renders immediately
- [ ] Edit base info form saves to localStorage
- [ ] Add New Project modal/form per section
- [ ] Search filters all three sections live
- [ ] Export JSON button works
- [ ] Mobile layout: three sections stack vertically
- [ ] `npm run build` passes, `next lint` passes
- [ ] Committed and pushed to `main`; DO deploy succeeds
- [ ] Live URL `https://www.silq.tech/nusilq` accessible with correct password
