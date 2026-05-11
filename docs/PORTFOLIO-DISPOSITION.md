# PixelForge — Portfolio Disposition

**Status:** Release Frozen — Tauri 2 + Rust AI image editor on
`origin/main` with Phase 4 AI operations (upscaling, inpainting,
style transfer, classification, palette) plus release-smoke
workflow scaffolding. Joins the signing cluster as the 11th member.

> Disposition uses strict `origin/main` verification.

---

## Verification posture

This repo has both `origin` (`saagpatel/PixelForge`) and
`legacy-origin` (`saagar210/PixelForge`) remotes. **Local clone's
`main` was correctly tracking `origin/main`** — no trap here, unlike
BattleGrid / PomGambler / FreeLanceInvoice / PersonalKBDrafter.

Specifically verified on `origin/main`:
- Tip: `0ce57bb` chore: add pull request template
- Substantive commits on `origin/main`:
  - `9d59ebe` feat: add Phase 4 AI operations — upscaling, inpainting, style transfer, classification, palette
  - `b5c36f2` feat: add image operations, export, AI background removal, and model manager
  - `f323f00` feat: scaffold Phase 1 with image viewer, zoom/pan, theme
  - `46a0055` fix(perf): sync PixelForge perf scripts
  - `5fa7f58` fix(rust): align PixelForge backend types
  - `bc97dc3` fix(ci): sync PixelForge desktop workflow assets
- Release scaffolding on `origin/main`:
  - `.github/workflows/release-smoke.yml`
  - `.codex/actions/release-smoke.sh`
- Tree: standard Tauri 2 layout (`src-tauri/`, `src/`, `tests/`,
  `scripts/`, Vite + TypeScript + pnpm)
- Default branch: `main`

---

## Legacy-origin orphan note

`legacy-origin/main` has 4 commits not on `origin/main`:
- 3 `chore(codex): bootstrap tests and docs defaults` — low value
- 1 `afdc266 feat(dev): add lean dev workflow and cleanup scripts` —
  developer convenience, lower stakes than gameplay/business
  features

Lower severity than FreeLanceInvoice's Stripe orphan from an earlier
round. Operator should review before considering them lost, but
they're not load-bearing.

---

## Current state in one paragraph

PixelForge is a Tauri 2 + Rust AI image editor desktop app. Phase 1
scaffolded the image viewer with zoom/pan and theme. Subsequent
phases added image operations (rotate, flip, resize, crop, blur,
sharpen, HSL adjustments, brightness/contrast), export pipeline,
AI background removal, model manager, then Phase 4 AI operations:
upscaling, inpainting, style transfer, classification, palette
extraction. Release-smoke workflow scaffolding present on
`origin/main` (`release-smoke.yml` + `release-smoke.sh`).

For full detail see `README.md`.

---

## Why "Release Frozen" instead of other dispositions

- **Active** — wrong. The product surface (Phase 4 AI operations)
  is complete; only signing is missing.
- **Cold Storage / Archived** — wrong. Phase 4 commit on `origin/main`
  is real recent product work.
- **Release Frozen** — correct. Joins the cluster.

This is the **11th signing cluster member**: DesktopPEt /
ContentEngine / AIGCCore / Relay / FreeLanceInvoice / Nexus /
DeepTank / OPscinema / ShipKit / SignalFlow / **PixelForge**.

---

## Unblock trigger (operator)

When ready to ship:

1. Wire Apple Developer ID + notarization credentials.
2. Run the existing `release-smoke.yml` workflow against the signed
   build to confirm gates still pass.
3. Verify the signed/notarized DMG opens cleanly with no Gatekeeper
   warnings.
4. Verify AI operations work end-to-end against locally-bundled
   models (or document the model-fetch step on first run).
5. Cut v0.1.0 release.

Estimated operator time once credentials are in hand: ~3 hours
including notarization round-trip.

---

## Portfolio operating system instructions

| Aspect | Posture |
|---|---|
| Portfolio status | `Release Frozen` |
| Review cadence | Suspend overdue counting |
| Resurface conditions | (a) Apple signing credentials wired, (b) operator decides AI model distribution strategy (bundled vs first-run download — likely a meaningful packaging decision for this product), or (c) operator opens a v0.2 scope packet |
| Co-batch with | Signing cluster: DesktopPEt / ContentEngine / AIGCCore / Relay / FreeLanceInvoice / Nexus / DeepTank / OPscinema / ShipKit / SignalFlow / **PixelForge** — **now 11 repos** |
| Special concern | **AI model distribution.** Bundled models inflate the .app size dramatically; first-run download keeps the app small but adds startup friction and offline-first claim issues. This is a release-unblock decision, not just signing. |

---

## Why this row has an extra unblock decision

The other signing-cluster repos all have a clean
"sign + tag + release" unblock. PixelForge has an additional axis:

**AI model distribution strategy.** The Phase 4 operations
(upscaling, inpainting, style transfer, classification) imply
non-trivial model dependencies:

- Option A: **bundle models in the .app** — clean offline-first,
  but the bundle becomes hundreds of MB to multiple GB
- Option B: **first-run download** — app stays small, but the
  user's first action is a wait + the app loses its "local-first"
  marketing claim when offline
- Option C: **operator-fetched script** — user runs a `download-models.sh`
  step explicitly; transparent but adds setup friction

This decision should be made **before** signing because it affects
the DMG content and notarization scope.

---

## Reactivation procedure (for the next code session)

1. Verify `git branch -vv` shows `main` tracking `origin/main`.
   This repo's local tracking was correct as of this disposition.
2. Delete stale `codex/*` branches that pre-date the Phase 4 commit
   (`9d59ebe`).
3. Review `legacy-origin/main` orphans — decide cherry-pick or
   accept-loss for the `afdc266 feat(dev)` commit.
4. Re-run `pnpm install && pnpm tauri build` to confirm the
   toolchain still works.
5. **Pick model-distribution strategy (A/B/C) before signing.**

---

## Last known reference

| Field | Value |
|---|---|
| `origin/main` tip | `0ce57bb` chore: add pull request template |
| Last substantive commit | `9d59ebe` feat: add Phase 4 AI operations — upscaling, inpainting, style transfer, classification, palette |
| Default branch | `main` |
| Build system | Tauri 2 + Rust + Vite + TypeScript + pnpm |
| Release scaffolding | `.github/workflows/release-smoke.yml`, `.codex/actions/release-smoke.sh` |
| Build verification status | green |
| Blocker | Apple signing + AI model distribution decision (operator-only) |
| Migration state | `legacy-origin` present; local tracking is correct |
| Legacy-origin orphans | 4 low-stakes commits (3 chore, 1 dev-workflow) |
| Distinguishing feature | AI model dependencies make model-distribution strategy a release-blocker, not just signing |
