# NuSilq Dashboard — Comprehensive Upgrade (Aug 2026)

## Role & Context

You are a dev agent implementing a set of feature upgrades to the internal NuSilq Project Dashboard at `silq.tech/nusilq`. Read this entire prompt before touching any files.

**Repository:** `c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website`
**Branch:** `main` → auto-deploys to DigitalOcean App Platform → `silq.tech`
**Password gate:** `Nusil!Silq2026`

---

## Data Architecture (Critical — read before editing)

There are **three layers**. Never collapse them.

### Layer 1 — Base Data
**File:** `public/data/nusilq/projects.json`
Static fields visible to all users. **Do NOT regenerate this file with the build script.** Make all changes as surgical JSON edits.

### Layer 2 — Cloud Overlay (Spaces)
Team members' notes and field edits are stored in DigitalOcean Spaces at `raoeqms-files/nusilq/notes.json` (sfo3 region). These are synced via `GET /api/nusilq/notes` and `POST /api/nusilq/notes`. You cannot read this directly — use the dashboard Export button if needed. **Never touch the `notes[]` arrays of existing entries in `projects.json`** — real notes live in the overlay.

### Layer 3 — localStorage
Local cache of the overlay. Not relevant to your edits.

### ID Stability Rule
**Never change a company's `id` field** once it exists. IDs are used as overlay keys in Spaces — changing them orphans all saved notes.

---

## Key Files

- `public/data/nusilq/projects.json` — base data
- `src/components/nusilq/types.ts` — TypeScript interfaces
- `src/components/nusilq/overlay.ts` — localStorage helpers + `mergeData()`
- `src/components/nusilq/NusilqDashboard.tsx` — main dashboard component
- `src/components/nusilq/ProjectCard.tsx` — card rendering for all sections
- `src/components/nusilq/AddProjectModal.tsx` — modal for adding new entries
- `next.config.js` — Next.js config (redirects, headers)

---

## Changes to Implement

### Change 1 — Sort All Sections by Last Updated (Descending)

Every section (Ongoing, Planned Engagements, Active Targets, Stalled) should display cards sorted by their `lastUpdated` (or `lastContact` for Stalled) field, **most recent date first**. Entries with a `null` or missing date appear at the **bottom**.

**Implementation:**

Add a sort utility in `NusilqDashboard.tsx` (or a shared util file):

```typescript
function sortByDate<T extends { lastUpdated?: string | null; lastContact?: string | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const da = a.lastUpdated ?? a.lastContact ?? null
    const db = b.lastUpdated ?? b.lastContact ?? null
    if (!da && !db) return 0
    if (!da) return 1   // nulls sink to bottom
    if (!db) return -1
    return db.localeCompare(da) // descending: newer first
  })
}
```

Apply `sortByDate()` to `filteredOngoing`, `filteredTargets`, `filteredStalled`, and `filteredPlanned` **after** the search filter, just before passing to the render list.

---

### Change 2 — New "PLANNED ENGAGEMENTS" Section

#### 2a — New TypeScript Type

In `src/components/nusilq/types.ts`, add:

```typescript
export interface PlannedEngagement {
  id: string
  companyName: string
  application: string
  engagementPlanDescription: string
  lastUpdated: string | null
  notes: NoteEntry[]
  source?: 'excel' | 'manual'
  _edited?: boolean
}
```

Update `ProjectsData` to include the new section:

```typescript
export interface ProjectsData {
  generated: string
  ongoing: OngoingProject[]
  planned: PlannedEngagement[]   // ← add this line
  targets: ActiveTarget[]
  stalled: StalledProject[]
}
```

Update `SectionKey`:

```typescript
export type SectionKey = 'ongoing' | 'planned' | 'targets' | 'stalled'
```

#### 2b — Update `mergeData` in `overlay.ts`

Add handling for the `planned` section in the `mergeData()` function (same pattern as `ongoing`, `targets`, `stalled`). Add a `manualPlanned` block analogous to `manualTargets`. The overlay key structure is identical — keyed by `id`.

Also update `loadOverlay` / `saveOverlay` if needed (they use a generic `Overlay` record, so they should work without changes).

#### 2c — New Card Component (or extend `ProjectCard`)

**Option A (preferred):** Add a `'planned'` case to the existing `ProjectCard.tsx` union type and rendering logic.

**Option B:** Create `PlannedEngagementCard.tsx` as a standalone component.

Either way, the card must:

**Condensed view shows:**
- Company name
- Application (subtitle, gray)
- `engagementPlanDescription` — shown in the condensed/collapsed view as the primary "action" line (use silq-blue text like `actionLabel` on ongoing cards)
- Date badge (lastUpdated) in top-right corner
- Notes count badge (if any)
- Expand/collapse chevron

**Expanded view additionally shows:**
- Application
- Engagement Plan Description
- Last Updated (formatted as "Month YYYY")
- Notes timeline
- Add note form
- Edit info form with fields: `companyName`, `application`, `engagementPlanDescription`, `lastUpdated` (date input)

**Accent color** — use violet to distinguish Planned from other sections:
- Card left border: `border-l-[3px] border-l-violet-400`
- Section header bar: `bg-violet-400`
- Section header text: `text-violet-600`
- Header border: `border-violet-200`

#### 2d — Layout in Dashboard

The right 1/3 column currently contains only Active Targets. It now needs to be a **vertical flex stack** containing:
1. **Planned Engagements** — compact, max-height ~220px, `overflow-y-auto`, with its own `SectionHeader` and `+ Add` button
2. **Active Targets** — `flex-1 min-h-0 overflow-y-auto`, takes the remaining height

The right column's total height is already matched to Ongoing Projects via `ResizeObserver`. That mechanism stays the same — just split the interior into two stacked subsections.

```tsx
{/* Right 1/3 column */}
<section
  className="xl:col-span-1 flex flex-col gap-3"
  style={ongoingHeight ? { height: `${ongoingHeight}px` } : undefined}
>
  {/* Planned Engagements — compact, fixed max height */}
  <div className="flex flex-col gap-2">
    <SectionHeader title="Planned Engagements" accent="planned" onAdd={() => setAddModalSection('planned')} />
    <div className="overflow-y-auto max-h-52 space-y-2 pr-0.5">
      {/* planned cards */}
    </div>
  </div>

  {/* Active Targets — takes remaining space */}
  <div className="flex flex-col gap-2 flex-1 min-h-0">
    <SectionHeader title="Active Targets" accent="teal" onAdd={() => setAddModalSection('targets')} />
    <div className="flex-1 overflow-y-auto min-h-0 space-y-2.5 pr-0.5">
      {/* target cards */}
    </div>
  </div>
</section>
```

Update `SectionHeader` accent config to include `'planned'`:

```typescript
const ACCENT_CONFIG = {
  // ...existing...
  planned: { bar: 'bg-violet-400', text: 'text-violet-600', border: 'border-violet-200' },
} as const
```

#### 2e — `AddProjectModal` support for `planned`

Add a `'planned'` case to the `AddProjectModal.tsx` component. The form fields for a new planned entry should be:
- Company Name
- Application
- Engagement Plan Description
- Last Updated (date input, optional)

#### 2f — Update `handleAddProject` in `NusilqDashboard.tsx`

The `handleAddProject` callback uses `addModalSection` to determine which array to append to. Extend it to handle the `'planned'` case.

---

### Change 3 — Move Med-El and Sophysa from Ongoing → Planned Engagements

#### 3a — Remove from `ongoing[]` in `projects.json`

Remove the two entries with these IDs from the `ongoing[]` array:
- `"id": "med-el"` (companyName: "Med-El")
- `"id": "sophysa"` (companyName: "Sophysa")

⚠️ **Important:** There is already a separate `"id": "med-el"` entry in `stalled[]` (companyName: "MED-EL", a different historical engagement). Do NOT remove or modify that stalled entry. The new planned entry must use a **different ID** to avoid collision: use `"id": "med-el-planned"`.

#### 3b — Add `planned[]` array to `projects.json`

Insert a new top-level `"planned": [...]` array in `projects.json`, **between `"ongoing"` and `"targets"`**. Populate it with these two entries:

```json
"planned": [
  {
    "id": "med-el-planned",
    "companyName": "Med-El",
    "application": "Cochlear Implants",
    "engagementPlanDescription": "Joseph to inquire during visit 7/29",
    "lastUpdated": "2026-07-15",
    "notes": []
  },
  {
    "id": "sophysa",
    "companyName": "Sophysa",
    "application": "Hydrocephalus Shunt",
    "engagementPlanDescription": "To follow up after Silq hydrocephalus shunt data/abstract published (August)",
    "lastUpdated": "2026-07-15",
    "notes": []
  }
],
```

Note: `"id": "sophysa"` is reused from the ongoing entry (there is no collision since the sophysa overlay notes, if any, will now apply to the planned entry — which is correct and intentional).

---

### Change 4 — Move Stedical Scientific and Todoc from Ongoing → Stalled

In `projects.json`:

**Remove** from `ongoing[]`:
- `"id": "stedical-scientific"` (Stedical Scientific, Introductory meeting 6/23/26)
- `"id": "todoc"` (Todoc, Cochlear Implants)

**Append** to `stalled[]` (at the end, after GC Aesthetics):

```json
{
  "id": "stedical-scientific",
  "companyName": "Stedical Scientific",
  "projectStatus": "Introductory meeting held 6/23/26. No further engagement.",
  "applicationDescription": "",
  "lastContact": "2026-06-23",
  "notes": [
    {
      "id": "note-stedical-moved",
      "timestamp": "2026-08-18T00:00:00.000Z",
      "author": "Aug 2026 update",
      "text": "Moved from Ongoing Projects. Initial meeting on 6/23/26; no further engagement logged."
    }
  ]
},
{
  "id": "todoc",
  "companyName": "Todoc",
  "projectStatus": "Todoc evaluating resource availability. No confirmed next steps.",
  "applicationDescription": "Cochlear Implants",
  "lastContact": "2025-07-01",
  "notes": [
    {
      "id": "note-todoc-moved",
      "timestamp": "2026-08-18T00:00:00.000Z",
      "author": "Aug 2026 update",
      "text": "Moved from Ongoing Projects. Last status: evaluating their resource availability for this project. tNDA sent June 9 2025."
    }
  ]
}
```

---

### Change 5 — URL / HTTPS Fix

Users report that navigating to `silq.tech/nusilq` (without https://) shows the homepage instead of the dashboard.

**Root cause:** When browsers follow an http:// → https:// redirect, the CDN may serve a cached RSC (React Server Component) payload for the root `/` route instead of `/nusilq`. The `Cache-Control: no-store` header already applied to `/nusilq` partially addresses this, but browsers with no prior HTTPS history for this domain will still attempt http:// first.

**Fix — Add HSTS (HTTP Strict Transport Security) header:**

In `next.config.js`, update the existing `headers()` function to add a global HSTS header that instructs all browsers to always use HTTPS for this domain going forward. After the first successful HTTPS visit, browsers will never attempt http:// again:

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains',
        },
      ],
    },
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

The `max-age=63072000` is 2 years (standard). This header tells browsers: "For the next 2 years, always use HTTPS for this domain — never try HTTP." After deployment, any user who visits the site over HTTPS once will be permanently protected.

---

## Summary of All JSON Changes (quick reference)

| Section | Change | ID |
|---|---|---|
| Ongoing | ➡️ MOVED to Planned | Med-El (`med-el`) |
| Ongoing | ➡️ MOVED to Planned | Sophysa (`sophysa`) |
| Ongoing | ➡️ MOVED to Stalled | Stedical Scientific (`stedical-scientific`) |
| Ongoing | ➡️ MOVED to Stalled | Todoc (`todoc`) |
| Planned | ➕ NEW (from Ongoing) | Med-El (`med-el-planned`) |
| Planned | ➕ NEW (from Ongoing) | Sophysa (`sophysa`) |
| Stalled | ➕ NEW (from Ongoing) | Stedical Scientific |
| Stalled | ➕ NEW (from Ongoing) | Todoc |

---

## Implementation Order

Follow this order to minimize broken intermediate states:

1. `types.ts` — add `PlannedEngagement`, update `ProjectsData`, `SectionKey`
2. `overlay.ts` — extend `mergeData()` for `planned` section
3. `projects.json` — all JSON edits (removes, adds, new planned array)
4. `ProjectCard.tsx` — add `planned` section support
5. `AddProjectModal.tsx` — add `planned` form fields
6. `NusilqDashboard.tsx` — layout changes, sort, planned section rendering
7. `next.config.js` — HSTS header addition
8. Build, lint-check, commit, deploy

---

## Build, Commit & Deploy

```powershell
cd "c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website"
npm run build
git add public/data/nusilq/projects.json src/components/nusilq/ next.config.js
git commit -m "feat: NuSilq dashboard upgrade — Planned Engagements section, date sorting, entries updated"
git push
```

`git push` to `main` triggers an automatic DigitalOcean App Platform deploy. The live site updates within ~5 minutes.

---

## QA Checklist (verify after deploy)

- [ ] Ongoing Projects cards are ordered most-recently-updated first
- [ ] Active Targets and Planned Engagements cards are similarly sorted
- [ ] Stalled Projects sorted by Last Contact descending
- [ ] Right column shows "Planned Engagements" above "Active Targets" with violet accents
- [ ] Planned Engagements cards show `engagementPlanDescription` in condensed view
- [ ] Med-El and Sophysa appear in Planned Engagements and NOT in Ongoing
- [ ] Stedical Scientific and Todoc appear in Stalled and NOT in Ongoing
- [ ] `+ Add` button in Planned Engagements opens a modal with the correct fields
- [ ] Edit form on a planned card saves and reflects the overlay
- [ ] Toolbar shows "Synced" after page load (Spaces overlay working)
- [ ] Navigating to `silq.tech/nusilq` (without https://) loads the dashboard (may require a second visit in same browser session for HSTS to take effect)
