# QA Protocol

Read with `SKILL.md` when a wave has QA work.

## 1. Tier and batching

| Tier | Scope | Required work | Default batching |
|------|-------|---------------|------------------|
| Q0 | docs/schema/contract | schema/lint/consistency; no browser | many stages → one QA |
| Q1 | code/unit/contract | `verify_sha` + 1–3 claim samples; full rerun only on first-use/mismatch | 3–5 stages → one QA |
| Q2 | runtime/product spot | Layer A + bounded headful product session | solo or same-URL wave |
| Q3 | product/visual exit | full signed DoD matrix (4 tabs @1080p) | solo once at exit |

Plan/footer must include:

```yaml
qa_tier: Q0 | Q1 | Q2 | Q3
qa_batch: solo | wave:<id>
qa_defer_layer_b: true | false
bake_policy: none | verify_sha | rebake_if_source_changed
browser_matrix: minimal | wave_spot | full_gate
q2_class: ROUTING_SMOKE | PRODUCT_SPOT | MEASURE_FULL | n/a
```

Rules:

- Q0/Q1 wave-batch is default.
- Q3 is not grouped with another stage.
- REM after measured failure is solo.
- `defer_qa: true` means wait until the wave end; self-test still runs per lead stage.
- QA verifies the exact shipped SHA.

## 2. Trusted harness

| Harness state | QA |
|---------------|----|
| First use or runner changed | full independent run once |
| Trusted (≥1 independent PASS, runner unchanged) | `verify_claims` + 1–3 samples + SHA |
| Lead nonzero exit, SHA/claim conflict | full rerun |

`bake_policy` defaults to `verify_sha`.
Re-import source dumps only when ETL/fixture SHA conflicts.
Large dumps remain under gitignored `artifacts/`; evidence records size, SHA and regeneration path only.

## 3. Layer A and Layer B

| Layer | Purpose | Failure |
|-------|---------|---------|
| A | code, schema, contract, unit, KPI formula tests | `INFRA-REGRESSION` |
| B | actual product behavior/visual/kiosk | `PRODUCT-UX-FAIL` or product failure |

Layer A never overrides a Layer B failure.

**Blind Layer A:** a unit/API PASS that cannot see the PE symptom is `NOT_MEASURED` for the product claim — not a seat.

| Wave class | Layer A is incomplete unless it also records |
|------------|-----------------------------------------------|
| KPI / BFF formula | fixture number vs response field (same unit) |
| Layout / 10-foot | overflow unit or computed style vs 1920×1080 |
| Widget state | loading/empty/error/stale contract tests |
| Kiosk rotation | timer/Redux invariant (does **not** seat visual) |
| Map / GIS | package id vs GeoJSON sample |

Q1 may verify SHA/claims. Q1 **must not** be `qa_tier` for visual / kiosk / KPI-on-screen waves. `qa_defer_layer_b: true` forbids overall PASS on those waves.

### Q2 class

| Class | Use | Layer B budget |
|-------|-----|----------------|
| `ROUTING_SMOKE` | URL/tab/failure handling; no layout/KPI change | one navigate + tab tick; visual N/A or smoke |
| `PRODUCT_SPOT` | layout/KPI-on-screen/kiosk risk | ≤1 valid empty-cache product run per arm + ≥1 1080p face |
| `MEASURE_FULL` | runtime metric/kiosk gate | metric harness + visual when DoD requires |

Q2 must not grow into a full 4-tab qualification matrix. Q3 owns full qualification.

## 4. Browser policy

For kiosk, 10-foot visual, map and charts:

1. Use `user-dev-chrome`.
2. Use `cursor-ide-browser` only for light DOM work after documenting Chrome unavailability.
3. Do not run two browser MCPs on the same golden URL.
4. Store screenshots by path; do not inline base64 in logs.
5. **Close stale tabs before each new test cycle**:
   - Call `list_pages` (MCP) or CDP `/json/list`.
   - Close leftover dashboard tabs and abandoned `about:blank` pages.
   - Keep at most one active measure page.
   - Viewport for TV claims: **1920×1080** (or 3840×2160 if 4K claimed).

One browser session per QA run.

## 5. Environment preflight and run class

Preflight occurs **before product navigation**:

```yaml
environment_preflight:
  browser_profile_fresh: true
  background_dashboard_tabs: 0
  viewport: 1920x1080
  device_pixel_ratio: recorded
  artifact_and_runtime_SHA: recorded
  data_arm: PRODUCT_LIVE | PRODUCT_FIXTURE | DIAGNOSTIC_MOCK
  cache_arm: PRODUCT_EMPTY_CACHE | PRODUCT_WARM_CACHE | DIAGNOSTIC_CACHE_DISABLED
```

Classify:

```yaml
INVALID_ENVIRONMENT_RUN:
  when: precondition fails before product navigation
  product_evidence: false
  consumes_attempt: false

PRODUCT_FAILURE_RUN:
  when: valid product-equivalent run misses a bar
  product_evidence: true
  consumes_attempt: true_if_falsifier_measured

PRODUCT_PASS_RUN:
  when: valid product-equivalent run meets bars
  product_evidence: true
  consumes_attempt: true_if_falsifier_measured
```

Do not discard a valid product failure as an outlier.
Do not turn a post-navigation product crash into `ENV-SKIP`.

## 6. Data arm and product equivalence

```yaml
PRODUCT_LIVE:
  product_default_config: true
  sources: CDE/ERP/P6 as signed
  product_claim_eligible: true

PRODUCT_FIXTURE:
  product_default_config: true
  sources: pinned JSON/Excel SHA
  product_claim_eligible: true   # only for claims that name this fixture

DIAGNOSTIC_MOCK:
  mock_or_faker: true
  product_claim_eligible: false
```

Qualification fingerprint must equal product-default fingerprint.
An observability flag may differ only when its `behavior_change: false` claim has been independently verified.
**Mock labeled as live is a product FAIL**, not environment skip.

## 7. Visual and 10-foot proof

| Tier/class | Minimum |
|------------|---------|
| Q0/Q1 | N/A |
| Q2 routing smoke | N/A or one smoke image |
| Q2 product spot/measure | ≥1 1080p reference face |
| Q3 | four tab faces + signed 10-foot rubric |

10-foot rubric (TV claims):

- no page scroll at 1920×1080;
- no font computed `< 18px`;
- ≤9 widgets on the tab;
- tables Top N ≤ 5 (or 7 if signed);
- Global KPI strip present on every tab;
- stale/offline never renders a blank wall.

Missing required visual evidence caps the verdict at `PARTIAL`.
One blocker face failure is `PRODUCT-UX-FAIL`.

## 8. First meaningful visual

FMV is not the first React paint.

```yaml
FMV:
  kpi_strip_readable: true
  primary_widget_content: present
  loading_mask: not_fullscreen_beyond_budget
  screenshot_against_reference: required
```

The campaign binds the measurable FMV threshold (e.g. KPI strip + map chrome visible) before using FMV as a gate.

## 9. Product load crash

Triggers:

- product UI reports tab/data load failure with blank wall;
- uncaught overlay covering the dashboard;
- browser tab death after payload landed.

Required action:

```yaml
qa_tag: PRODUCT-LOAD-CRASH
product_load_crash: OPEN
verdict: FAIL
```

While open: do not advance; do not close a residual using that session; route only a crash-class lever, or strategy after the measured cap.

Clearance requires a valid product-equivalent run with no fail overlay and the stage visual/KPI gate met.

## 10. Qualification sequence

For a bounded three-run gate:

```yaml
valid_sequence:
  runs: 3
  same_SHA: true
  same_product_fingerprint: true
  foreground: true
  environment_valid: true

reset_when:
  - any valid run exceeds the time bar
  - any valid run misses visual/KPI Ready
  - any valid run crashes
  - any valid run finalizes incomplete

do_not_reset_when:
  - environment preflight rejects before navigation
```

Kiosk 24h soak is **not** a Task qualification sequence. Record soak separately; do not hang a QA Task for 24h.

## 11. Verdict and report

QA reports:

```yaml
run_class: INVALID_ENVIRONMENT_RUN | PRODUCT_FAILURE_RUN | PRODUCT_PASS_RUN
attempt_outcome: PASS | FALSIFIED | NOT_MEASURED
falsifier_measured: true | false
scope: SESSION_ONLY | PRODUCT
layer_a: PASS | FAIL | PARTIAL | SKIP
layer_b: PASS | FAIL | PARTIAL | ENV-BROWSER-SKIP | N/A
visual_face_check: PASS | FAIL | PARTIAL | N/A
product_load_crash: OPEN | CLEARED | N/A
verdict: PASS | PARTIAL | FAIL
```

`scope` is mandatory:

- `SESSION_ONLY` — what this session observed. Never rebuts standing PO product evidence.
- `PRODUCT` — a valid product-equivalent run whose verdict binds the product seat.

Hard vetoes:

- overall `PASS` forbidden when Product Evidence contradicts the claimed outcome;
- `falsifier_measured: false` → `attempt_outcome: NOT_MEASURED`;
- overall `PASS` forbidden when WAVE_CARD `measure_where` includes `PRODUCT_BROWSER` and `layer_b` is `N/A` or `ENV-BROWSER-SKIP`;
- overall `PASS` forbidden on Q1 when `pe_symptom` is visual / kiosk / KPI-on-screen;
- do not set `next_agent: PO-human`; hand off to technical → strategy.

## 12. Intermittent failure reproduction (perturbation protocol)

A failure reported by a user/PO but not reproduced under harness conditions is often timing/environment dependent. Repeating identical harness conditions is foreseeable NO_REPRO.

Rules:

1. **At most one** identical-condition repeat. After that, vary at least one axis:

```yaml
perturbation_axes:
  cpu_throttle: 4x | 6x
  network: Fast3G | offline-then-online
  interact_during_load: tab-switch / resize mid-fetch
  viewport: 1920x1080 | 3840x2160 | tablet landscape
  cache_arm: alternate EMPTY / WARM
  data_arm: LIVE vs FIXTURE (never MOCK for product claims)
```

2. **Bound the hunt**: one wave, ≤6 perturbed cycles. Still NO_REPRO → `scope: SESSION_ONLY` and route to strategy for deterministic hardening (STRATEGY-AND-GOVERNANCE §4.2).
3. Capture the reporting user's environment once (viewport, kiosk vs desktop, mock vs live).
4. A perturbed-cycle repro **is** valid product evidence; note the triggering axis.

## 13. Batch probes per cold cycle

When the campaign has multiple open product seats (KPI / 10-foot / kiosk / stale), every valid cold cycle records the probe set for **all** of them. Opening a new wave to collect a metric the previous cycle could have recorded is an efficiency violation (SKILL.md §4.5).
