# Dev agent prompt: Prefilled contact form from URL (`message` query param)

Copy everything below the line into a new chat for the implementing developer agent.

---

## Role and goal

You are implementing a **small, secure enhancement** to the Silq marketing site contact form so that visiting:

`https://www.silq.tech/contact?message=<encoded-text>`

loads the existing **Contact** page with the **“How can we help you?”** textarea (`message` field in code) **prefilled** from the query string. **Name** and **Email** must stay **empty** and **required** as today—do **not** accept or prefill `name`, `email`, or any other PII from the URL.

This supports the **Milly** chat widget: the assistant can give users a link with a short, encoded draft message; the user completes identity fields and submits.

## Repository context

- **App:** Next.js 14 App Router (`silq-website`).
- **Contact UI:** `src/components/sections/ContactForm.tsx` — client component, `react-hook-form` + `zod`, field `message` with label **“How can we help you?”**, validation `message` **min 10 characters**.
- **Contact page:** `src/app/contact/page.tsx` — renders `<ContactForm />`.
- **API:** `src/app/api/contact/route.ts` — already accepts JSON body; no API change required unless you discover a gap (there should not be one for this feature).

## Functional requirements

1. **Single supported query param for prefill:** `message` (lowercase key only). Ignore unknown keys for prefill purposes.
2. **Decode safely:** Treat the value as **UTF-8 text** after standard **query decoding** (`decodeURIComponent` once on the param value; handle malformed encoding without throwing—fallback to empty / omit prefill).
3. **Whitespace:** Trim leading/trailing whitespace before applying. If the result is **empty**, do not prefill.
4. **Minimum length (10 chars):** Align with existing Zod rule. If decoded+trimmed text is **shorter than 10 characters**, **do not prefill** (leave placeholder behavior). Optionally you may log in dev only; do not show a scary error for this edge case.
5. **Maximum length:** Cap prefilled text (e.g. **1500–2000 characters**) to avoid abuse and URL size issues; truncate with a hard cut (no ellipsis mid-word required; simple slice is fine).
6. **No HTML / script injection:** The value is plain text in a `<textarea>`. Do **not** use `dangerouslySetInnerHTML`. Strip or refuse **NUL** bytes. Normal textarea behavior is sufficient; do not introduce rich HTML rendering.
7. **One-time application:** Prefill from the URL **once on initial load** so you do not overwrite user edits if they change the message and the component re-renders. Typical pattern: `useRef` guard or `useEffect` with empty deps + `setValue('message', ...)` from `react-hook-form`.
8. **Do not prefill name or email** from query params—even if present, ignore them (privacy + product requirement).
9. **Canonical host:** Milly links will use **`https://www.silq.tech`**. No need to redirect in this task; just document for Milly.

## Next.js implementation notes

- Use **`useSearchParams`** from `next/navigation` inside `ContactForm` (or a tiny child component) to read `message`.
- Next.js 14: components that call **`useSearchParams`** should be wrapped in a **`<Suspense>`** boundary when the parent might be statically rendered. Update **`src/app/contact/page.tsx`** to wrap `<ContactForm />` in `<Suspense>` with a simple, accessible fallback (e.g. skeleton or `null` + same layout height if you want zero layout shift—keep it minimal).
- Wire **`setValue`** from `useForm` and consider **`shouldValidate: true`** or trigger validation after set so the user sees valid state when text ≥ 10 chars.
- Optional UX: after applying prefill, **`history.replaceState`** to remove `?message=...` from the visible URL **without** reloading, so long text does not linger in the address bar and users are less likely to copy a huge URL. This is optional but recommended; ensure it does not break browser back expectations (replaceState is acceptable here).

## Out of scope

- Do **not** add prefill for `inquiry`, `subject`, `email`, `name`, etc., unless product later expands scope.
- Do **not** change submission email copy or Resend logic except if you find a pre-existing bug.
- Do **not** add new dependencies unless strictly necessary.

## Verification (manual)

1. Visit `/contact` — form behaves exactly as before (no regression).
2. Visit `/contact?message=` — no prefill.
3. Visit `/contact?message=Hello%20world` (under 10 chars) — no prefill.
4. Visit `/contact?message=` + a string **≥ 10 chars** — textarea shows decoded text; name/email empty; submit still requires both.
5. Very long `message` — truncated to your cap; page remains responsive.
6. Malformed percent-encoding — no white screen; no prefill or graceful skip.

## Deliverables

1. Code changes as above, minimal diff, matching existing patterns (formatting, hooks, TypeScript).
2. Short note in **`docs/milly-ai-agent-context.md`** (or a single new bullet in the contact section) documenting: supported param **`message`**, **www** URL, encoding requirement, min length, max length, name/email never from URL.

---

## After implementation: instructions for the product owner (Milly admin)

**Provide the following to Ethan / the Milly admin (copy-paste).**

### 1. Link Buttons (Milly → Response Settings → Link Buttons)

Add one rule so contact deep links render as a button when the model outputs a full URL:

| Field | Suggested value |
|--------|------------------|
| **URL contains** | `silq.tech/contact?message=` |
| **Button label** | `Open contact form` (or `Continue to contact form`) |

Adjust label to taste. If Milly only ever uses `www`, you can tighten the match to `www.silq.tech/contact?message=`.

### 2. AI Instructions (same screen)

Add lines similar to:

- When offering a contact link, use **`https://www.silq.tech/contact?message=`** plus a **URL-encoded** draft for the **“How can we help you?”** field only. **Never** put name, email, phone, or medical details in the URL.
- Keep prefilled text **short** (suggest under ~400 characters in instructions), **plain language**, and **at least 10 characters** after encoding/decoding so the form accepts it without edits.
- Tell the user they must **enter name and email** on the page before sending.
- Omit the `message` parameter entirely if you have nothing useful to prefill; do not send empty or trivial placeholders.

### 3. Disclaimer reminder (optional)

If the disclaimer mentions not sharing data, you can add that **URLs may appear in browser history**—users should avoid putting sensitive information in the prefilled line.

---

## Success criteria

- Milly can share a working **www** link; the contact page opens with **How can we help you?** prefilled when valid; **name** and **email** are always user-entered; validation and API behave as before.
