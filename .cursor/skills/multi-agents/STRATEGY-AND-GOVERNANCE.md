# Strategy and Governance Protocol

Repo-wide. Read with `SKILL.md` for strategy dispatch, PO-proxy adjudication, PO packets,
closure, or model fallback.

## 1. Strategy as adversarial PO-proxy

`strategy-advisor` stands between the team and PO-human. Its job is to keep PO out of
technical ticks and to keep weak evidence out of PO packets.

```text
Team evidence / technical report
  → strategy adjudicates (raw evidence first)
    → TEAM_DIRECTIVE (continue without PO)
    → or STRATEGY_PO_PACKET (only Success / Ceiling / PO Visual / signed scope checkpoint)
```

## 2. Strategy trigger

Call strategy when **any** is true:

- authorize/close a box or phase;
- report-up after QA on a phase gate, checkpoint, or Q2+ product claim;
- replan or campaign pivot;
- change definition, KPI contract, bar, or architecture scope;
- evidence conflict across independent sources;
- Product Evidence vs claim mismatch;
- owner MEDIUM/UNKNOWN after a measurement wave;
- same symptom crossed two lever classes or three measured cycles;
- box cap spent;
- inconclusive / ceiling-partial route request;
- PO explicitly asks for strategic review.

Do **not** call strategy for:

- one already-approved root cause + one lever still inside that approval;
- QA scope approval alone;
- mechanical ADVANCE_SHORT inside an already strategy-approved micro-stage;
- pure self-test green with no product claim.

## 3. Input order

```text
1. Current PO contract / North Star / authorized_box / original bars
2. Raw evidence: result.json, claims.yaml, screenshots, KPI vs fixture
3. Strategy's own metrics and campaign-goal check
4. Technical report-up and lead/QA narrative for conflict/provenance only
```

Strategy must:

- challenge at least one team assumption;
- distinguish product failure from measurement failure;
- distinguish Ceiling of an arc/lever set from a product ceiling;
- reject sunk-cost routing;
- map the decision to Success, Ceiling, continue-in-cap, or PO-visible **scope** progress;
- reject all technical options when none materially closes the product gap.

## 4. Adjudication outputs

```yaml
STRATEGY_APPROVE_EXECUTION:
STRATEGY_REJECT_AND_DIRECT:
STRATEGY_HOLD_MEASURE:
STRATEGY_AUTHORIZE_PHASE:
STRATEGY_CLOSE_CEILING:
STRATEGY_PO_PACKET:
```

### 4.1 Rejection checklist IDs (log budget)

Cite standard IDs; prose only for a **new** rejection class:

| ID | Rejected claim |
|----|----------------|
| S1 | Session/telemetry/Lighthouse PASS presented as product PASS |
| S2 | Erasing standing user/PO product evidence via session no-repro |
| S3 | New rem in a class whose measured cap is spent (grind) |
| S4 | Expanding a bounded observe wave after bound spent |
| S5 | Success/Ceiling/Visual packet while precheck fails |
| S6 | API 200 / SWR success presented as UX progress |
| S7 | Technical option menu or phase-ack escalated toward PO |
| S8 | Rem / class-spend without a seated **causal-layer skeleton** |
| S9 | Downstream / optional fail treated as upstream incomplete (e.g. map tile fail sold as KPI strip never loaded) |
| S10 | Conflating **symptom nicknames** with **causal layers** |
| S11 | Layer A / unit PASS sold as product seat while the gate is **blind** to the PE symptom |
| S12 | Lever authorized on a **qualitative** upper bound without the same-unit remaining gap |
| S13 | Knockout metric **shares convention** with the code under test (FE formats the same number it computed) |
| S14 | Waiting for QA when the fixture/source table already falsifies the class |
| S15 | Rubber-stamp PO/team knockout without an independent recompute against a **higher** ground truth |

Body of a strategy adjudication should stay ≤ ~6 KB: verdict, ≥3 own claims from raw evidence, ≥1 challenge, path pick, directive — rejections as `rejected: [S1, S3, …]`.

### 4.2 Deterministic hardening (typed race exception)

“No rem without reproduction” is correct against blind grind but wrong for **typed race classes** (ordering/timing failures seen by a user, not reproduced under harness — see QA-PROTOCOL §12). After a bounded perturbation hunt still yields NO_REPRO, strategy may authorize **one** deterministic-hardening rem without prior repro when all hold:

1. The failure class is typed as an ordering/race (e.g. kiosk rotate before tab data settle).
2. The lever **enforces an ordering invariant**, rather than tuning timing.
3. It ships with a **loud assertion instrument**.
4. It counts as one measured attempt; the falsifier is the assertion plus golden PE.

### 4.3 Large-lever escalation

When a product bar remains OPEN and small-rem classes are exhausted, strategy must **not** default to ACCEPT-residual or Option menus to PO.

Required within one strategy cycle:

1. Emit a `LARGE_LEVER_CARD` (BFF aggregation · ETL source · or architecture thin slice).
2. Prefer product-visible KPI/10-foot metrics under the PO's stated test environment (TV 1080p).
3. Thin-slice timebox: one falsifiable large change per wave.

Rejection IDs: `L1` ACCEPT residual as absolute close · `L2` mock-as-live park · `L3` wait for PO Option before large trial · `L4` completeness grind without KPI/visual mapping · `L5` mega-arc without falsifier · `L6` Soft invent Program Ceiling/Success from arc-rem Ceiling.

### 4.4 Causal-layer skeleton (theory before rem)

Reusable method for **any** product bar that is a multi-stage causal chain (live KPI, 10-foot layout, kiosk, GIS). Campaigns seat an **instance**.

**When it binds** (any one): PO or Product Evidence describes a **sequence** of faces / states; same symptom crossed **two lever classes** or owner is MEDIUM/UNKNOWN; ARG mapping is weak because the stage is unnamed; team is patching a **nickname** as if it were the bar.

**Order (binding):**

```text
1. SEAT skeleton    name causal layers; strip waste; prove the story is theoretically tight
2. EXPECT vs ACTUAL per layer: machine-backed + what leadership must see
3. THEN rem         one layer at a time, lowest unfinished layer first
```

Do **not** skip to step 3 while step 1 is unseated or the target layer’s expected face is `NOT_MEASURED`.

Example layers (Tab 1 live): `source-sync` → `bff-kpi` → `tab-payload` → `widget-render` → `ten-foot-paint`.

**Per-layer card (required in the strategy log before rem on that layer):**

```yaml
layer_id: <campaign-defined>
theory: <one sentence why this layer exists>
expected_machine: <what must be true in API / DTO / store>
expected_product: <what leadership must see if this layer is healthy>
actual: PASS | FAIL | NOT_MEASURED
root_if_fail: <named owner on THIS layer only — or unknown>
next: HOLD_MEASURE | rem this layer | escalate skeleton
```

`rejected: [S8]` WAVE_CARD rem with no seated skeleton and no `layer_id`.
`rejected: [S9]` optional/downstream fail sold as upstream incomplete.
`rejected: [S10]` directive treats a symptom nickname as a causal stage.

### 4.5 Independent forensic (binding)

Strategy can fill S1–S10, ARG, and ≥3 claims **and still authorize the wrong class** if it treats team Layer A or a memo as truth.

**Job:** produce or require a number that the team's self-test did not report, against a ground truth **above** the code under test.

**When it binds** (any one): Product Evidence conflict · visual/10-foot/KPI-on-screen/kiosk · Layer A PASS with PE FAIL or PE not yet measured · same symptom after a rem · owner MEDIUM/UNKNOWN · authorizing a new lever class.

**Ground-truth rank (high → low). Never use a lower row to rebut a higher one:**

```text
1. PO-eyes / Product Evidence (1080p screenshot, wrong number on TV, scroll)
2. Pinned source fixture (CDE/ERP export SHA) + signed KPI formula
3. BFF response JSON vs formula
4. Unit tests / Lighthouse / heap / Node self-test
```

A FE formatter that **prints the same number it computed** cannot prove BFF honesty (`S13`). Unit Layer A cannot prove 10-foot readability (`S11`).

**Blind-gate audit:** Name **one** PE symptom the gate cannot see. If that symptom **is** the open product failure, Layer A PASS = `NOT_MEASURED` for the product claim.

**Quantified upper bound (required before `STRATEGY_APPROVE_EXECUTION` on a rem):**

```text
remaining_gap     in the unit the user fails (px overflow, % KPI delta, font px, blank widgets)
lever_max_effect  in the SAME unit, from a measurement this turn
ub_closes_gap     true only if lever_max_effect can materially close remaining_gap
```

“Glass looks nicer” is not a bound if overflow is 180 px (`S12`).

**Do not wait (`S14`):** if the fixture table already falsifies the seated class, close it this cycle.

**Independent measurement duty:** Strategy **may** write a **read-only** instrument under `Documents/1-Sprints/<Campaign>/evidence/**/instrument/`. Allowed: compare fixture vs screenshot/API JSON, print JSON under `evidence/**`. Forbidden: change production behavior.

If the artifact is not on disk this turn → `STRATEGY_HOLD_MEASURE` naming the exact command + path.

**Footer block (required when this section binds):**

```yaml
independent_forensic:
  ground_truth: <PE | fixture path | kpi-contract>
  own_knockout: "<one number this turn, not copied from Layer A>"
  layer_a_blind_to: <PE symptom or none>
  remaining_gap: <n unit>
  lever_max_effect: <n unit or n/a if HOLD>
  ub_closes_gap: true | false | n/a
  wait_qa_forbidden: true | false
  rejected: []  # S11–S15 as applicable
```

`STRATEGY_APPROVE_EXECUTION` for a product rem requires `ub_closes_gap: true`, `own_knockout` filled from this turn, and `layer_a_blind_to` either `none` or named as a **new** WAVE_CARD gate.

### Forbidden PO asks

Never put these in a PO packet:

- ack next technical phase;
- choose harness flag / rem instrumentation;
- tick Option A/B/C;
- approve incomplete measurement as progress;
- dump logs as the main ask.

If those are the only remaining questions → `STRATEGY_REJECT_AND_DIRECT` or `STRATEGY_HOLD_MEASURE`.

## 5. PO packet precheck

Before `STRATEGY_PO_PACKET`:

```yaml
PO_PACKET_PRECHECK:
  decisive_metrics_measured: true
  product_evidence_supports_claim: true
  run_class_valid_for_product_claim: true
  product_fingerprint_equivalent: true
  open_NOT_MEASURED_on_decision_metric: false
  technical_options_to_PO: false
```

Any false → reject packet; issue team directive instead.

## 6. ARG — Architecture Review Gate

```yaml
ARG:
  product_mapping: "Does the metric/lever improve what leadership sees or can do?"
  definition: "Are bar, KPI denominator and 10-foot Ready physically defined?"
  measured_owner: "Is the owner measured, co-dominant or distributed?"
  lever_viability: "Can the lever's upper bound materially close the gap IN THE SAME UNIT?"
  contract_risk: "Does it threaten BFF-KPI, 10-foot, kiosk, or live-vs-mock?"
  grind: "Has this class already consumed its measured cap?"
```

ARG fail → replan / definition box / Ceiling. Do not delegate another lever in the same class.

## 7. PO governance

When a campaign has a PO-signed charter:

- team routes autonomously inside cap under strategy PO-proxy;
- do not send technical options, routine QA failure, or logs to PO;
- PO-human packets are only Success · Ceiling · PO Visual after QA PASS · signed **scope** checkpoint.

Visual-first: Lighthouse/TTI/FPS remain telemetry until the 10-foot/KPI-on-screen gate passes.

### Ceiling meaning

Ceiling closes the current authorized arc/lever set. It does not establish a permanent product ceiling unless the packet explicitly proves and the PO accepts that broader scope.

```yaml
ceiling_scope:
  arc:
  lever_set:
  architecture_assumptions:
  product_ceiling_claimed: false | true
```

Default: `product_ceiling_claimed: false`.

### PO packet shape

One page, product language:

```yaml
goal_and_original_bars:
measured_outcome:
product_visible_result:
valid_attempts_spent:
residuals:
team_recommendation:
PO_scope_decision_needed:
evidence_path:
```

No dump logs or technical option menu.

## 8. Model ladder

Only strategy receives an explicit high-tier `model=`:

| Tier | Model | Use |
|------|-------|-----|
| L0 | `composer-2.5-fast` | mechanical PO-proxy log/authorize |
| L1 | `cursor-grok-4.5-high` | default strategy analysis |
| L2 | `claude-sonnet-5-thinking-high` or `gpt-5.6-terra-medium` | moderate conflict |
| L3 | `claude-opus-5-thinking-high` or `claude-fable-5-thinking-high` | major replan |

Do not default to L3.

Fallback: peer same tier → down-tier → omit `model=` (Cursor Auto). Record intended/actual/fallback. Tactical agents always omit `model=`.

## 9. Telegram

After an allowed PO halt (`STRATEGY_PO_PACKET`), send a short Vietnamese message:

```text
Kết quả: <product outcome>
PO cần: <one scope decision>
Chi tiết: <path>
```

No logs or jargon. Never Telegram for team-internal directives. Notify script is optional until added to this repo.
