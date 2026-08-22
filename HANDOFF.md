# Session handoff — Deep Real Estate, finalised build

_Last updated at the end of the session that stood up the finalised repo + Neon DB._

## One-paragraph state

The finalised site is deployed and **one step from done**. The build is live on
Vercel (security headers confirmed), the Neon database is created + seeded, and
the API is consolidated to 9 serverless functions. **What remains: set two env
vars in the Vercel project and redeploy.** Until then `/api/*` returns
`500 FUNCTION_INVOCATION_FAILED` because `api/_lib/db.ts` throws at import when
`DATABASE_URL` is absent.

## Coordinates

| | |
|---|---|
| Canonical repo | `https://github.com/deeprealestateresponses-commits/Deep_Real_Estate_Main` (branch `main`) |
| Local working copy | `D:/Codes/Deep-Real-Estate-Final` — `origin` points at the canonical repo |
| Live URL | `https://deeprealestateresponses-commits-mai.vercel.app` (admin at `/#admin`) |
| Vercel + GitHub owner | `deeprealestate.responses@gmail.com` |
| Enquiry inbox (FormSubmit) | `deeprealestate.responses@gmail.com` (already wired in `contact-form.tsx`) |
| HEAD at handoff | `1979869` |

There is also an OLDER repo `NitrateNO3/Deep-real-estate-tanya` (the experimental
"tanya" server) and its deploy `deep-real-estate-tanya.vercel.app`. That keeps the
full detailed git history. **Go-forward work is on the new repo only.**

## What is DONE

- Finalised codebase: React site (`ui/`) + serverless admin API (`api/`) + schema/seed (`db/`).
- Legacy PHP stack removed entirely; **repo is PHP-free**, ~70 MB, clean single-lineage history.
- API consolidated **15 → 9 functions** (Hobby cap is 12) via dynamic routes — URLs unchanged:
  `auth/[action].ts`, `blogs/[[...slug]].ts`, `admin/{properties,notices,blogs}/[[...id]].ts`.
- Security hardening in place and tested: parameterised queries, scrypt + `__Host-` session
  cookie, layered login throttle (per-IP + backoff + global cap with owner-exemption),
  CSP + 5 more headers in `vercel.json`, input allow-lists, `@vercel/blob` upgraded (0 prod
  vulns), dependabot. `npm run selfcheck` = 42 checks.
- **Neon DB created + seeded** — the two listings (`suncity-floors`, `farmhouse-garatpurbas`)
  are in `properties`. Ran `npm run db:setup` successfully against Neon.
- Build live on Vercel: CSP + `X-Frame-Options` confirmed present on `/`.

## What REMAINS (the only blockers to a working admin)

In the Vercel project for `deeprealestateresponses-commits-mai`, **Settings → Environment
Variables** (tick Production + Preview + Development), then **redeploy**:

1. `DATABASE_URL` — should already be set by the Neon integration. Confirm it exists.
   (Value is the pooled Neon URL; the owner has it. The Neon password was pasted into the
   prior chat — **recommend rotating it** in the Neon dashboard once live.)
2. `SESSION_SECRET` = `1b78fc45d27d4780dcdc662ad8f4cb95b7164aa4f1624e7b165d826c6df69b5f`
3. `ADMIN_PASSWORD_HASH` — owner runs `npm run hash-password` locally (picks their own
   password, 12+ chars), pastes the printed `scrypt$…` value. **Never generate this from a
   password typed into chat.**
4. Optional: `BLOB_READ_WRITE_TOKEN` — add a Vercel Blob store only if image upload is wanted.
   Without it, uploads return 501 and the storage meter hides itself; everything else works.

Then **Deployments → ⋯ → Redeploy** (env changes need a fresh build).

## Verify once redeployed

- `https://…/api/properties` returns **JSON** (2 listings), not a 500.
- `curl -I https://…/` shows `Content-Security-Policy` + `X-Frame-Options` (already true).
- `https://…/#admin` → log in with the Step-3 password → CRUD works.
- If uploads are configured: add a photo, confirm it stores and the storage meter moves
  (this and the headers are the only things unverifiable locally).

## Local development

```bash
cd D:/Codes/Deep-Real-Estate-Final
npm install && npm --prefix ui install
npm run dev:local            # site :5173, API :3000 (PGlite in-process DB)
```
Admin at `http://127.0.0.1:5173/#admin`, dev password `local-admin-password`.
`npm run selfcheck` runs the 42 security/logic checks (no DB needed).
The local harness (`scripts/dev-server.mjs`) mirrors Vercel routing incl. the catch-alls.

## Gotchas / things a future session MUST know

- **Never add `admin/` to `.vercelignore`.** It matches `ui/src/admin/` (the React panel) at
  any depth and breaks the build with "Cannot find module './admin/admin-panel'". A comment
  in `.vercelignore` says so. (This caused a deploy failure this session.)
- **Root Directory in Vercel must be `./`**, not `ui/` — the `/api` functions live at the root.
- **Function count ≤ 12 on Hobby.** Currently 9. Adding routes: prefer merging into an existing
  dynamic file over a new one.
- **`db:setup` uses a `runRaw()` helper** because the Neon HTTP driver has no `sql.query()`.
- **No per-session revocation** — signing out clears the cookie but doesn't invalidate the
  token; rotating `SESSION_SECRET` is the real kill switch (documented in `ADMIN.md`).
- **Least-privilege DB role** is recommended but not yet applied — see `ADMIN.md`.

## Open decisions for the owner

- **Displayed public email** is still `info@deeprealestate.in` across the site (footer, contact,
  legal text). Only the enquiry *routing* uses the gmail. Left as-is deliberately (a gmail as
  the shown business address / in DMCA text reads worse). Swap on request.
- Whether to also push `main` of the old tanya repo anywhere, or retire it.

## Full detail

`ADMIN.md` in the repo has the complete setup, the kill-switch procedure, and the
least-privilege DB role SQL. The plan file at
`C:/Users/storm/.claude/plans/https-deeprealestate-in-scan-this-websit-giggly-sparkle.md`
has the security-audit results (13/20 passed, 7 fixed).
