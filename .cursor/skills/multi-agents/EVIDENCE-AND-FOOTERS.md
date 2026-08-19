# Evidence and Footer Contracts

Read with `SKILL.md` when producing or adjudicating campaign evidence.

## 1. Machine SSOT

Each evidence-producing wave ships:

```text
<evidence-root>/
  result.json
  claims.yaml
  evidence-index.json
```

Required common fields:

```yaml
schema: <versioned schema>
campaign: <id>
wave_id: <id>
verify_sha: <git SHA>
artifact_manifest_sha: <SHA or n/a>
product_runtime_fingerprint_sha: <SHA or n/a>
behavior_change: true | false
url_class: CLEAN_PRODUCT | PRODUCT_MINIMAL_MEASURE | HARNESS_MEASURE | N/A
authority: PRODUCT | DIAGNOSTIC | PROCESS
run_class: INVALID_ENVIRONMENT_RUN | PRODUCT_FAILURE_RUN | PRODUCT_PASS_RUN | N/A
attempt_outcome: PASS | FALSIFIED | NOT_MEASURED | N/A
bars_changed: false
```

Logs summarize; they do not duplicate raw timelines or metric tables.

## 2. Environment fingerprint

Every product qualification run records, when available:

```yaml
RUN_ENVIRONMENT_FINGERPRINT:
  git_SHA:
  artifact_manifest_SHA:
  fixture_or_source_SHA:
  browser_version:
  browser_profile_id:
  viewport:
  device_pixel_ratio:
  OS_free_memory:
  browser_JS_heap_used:
  cache_state:
  data_arm: PRODUCT_LIVE | PRODUCT_FIXTURE | DIAGNOSTIC_MOCK
  kiosk_mode: true | false
  timestamp:
```

Unavailable fields are explicit `null` with a reason; do not invent values.

## 3. Effective runtime fingerprint

```yaml
EFFECTIVE_RUNTIME_CONFIG:
  api_base:
  data_arm:
  fixture_SHA:
  cache_enabled:
  cache_state:
  kiosk_mode:
  perf_mode:
  anonymize_units:
  i18n_locale: vi | en
  qualification_flags:
  fingerprint_SHA:
```

Qualification fingerprint must equal product-default fingerprint.
Observability flags require an independently verified `behavior_change: false`.

## 4. Prediction ledger

Before measurement:

```yaml
prediction:
  hypothesis_id:
  metric:
  expected_range:
  confidence:
  falsifier:
  written_at:
  written_before_result: true
```

After measurement:

```yaml
prediction_result:
  actual:
  delta_from_prediction:
  verdict: CONFIRMED | FALSIFIED | INCONCLUSIVE
  model_was_wrong_because:
  next_discriminator:
```

Do not edit the prediction after seeing the result. Append the result.

## 5. Product and engineering evidence

### Product evidence (decides)

- canonical product URL;
- effective runtime fingerprint;
- 1920×1080 (or claimed 4K) screenshot/recording;
- KPI numbers vs fixture/source;
- 10-foot checks (no-scroll, font, Top N);
- kiosk rotation / stale-offline badge;
- map package vs GIS sample.

### Engineering evidence (explains)

- unit/API tests;
- Lighthouse / TTI / heap;
- source and artifact SHA;
- self-tests and verification.

No Product Evidence → no product Success Packet.

## 6. Lead-dev footer

```yaml
agent: lead-dev
cycle_id: CYCLE-YYYY-MM-DD-<topic>
wave_id: <id>
authorized_box: <box-id>
scope_in: []
scope_out: []
wave_card_path: <path>
one_allowed_lever: <id> | OBSERVE_ONLY
behavior_change: true | false
qa_tier: Q0 | Q1 | Q2 | Q3
qa_batch: solo | wave:<id>
defer_qa: false | true
bake_policy: none | verify_sha | rebake_if_source_changed
regression_scope: []
product_runtime_fingerprint_expected: <sha-or-path>
instrument_verified: non_null_warm_run | n/a
self_test_covers_pe_symptom: true | false
measure_where_ran: NODE | PRODUCT_BROWSER | BOTH | n/a
self_test:
  - cmd: "<cmd>"
    exit: 0
machine_evidence:
  result: <path-or-n/a>
  claims: <path-or-n/a>
  index: <path-or-n/a>
rollback: "<command/flag/commit boundary>"
verdict: SHIPPED | PARTIAL | BLOCKED
next_agent: qa-agent | lead-dev | technical-advisor
```

## 7. QA footer

```yaml
agent: qa-agent
cycle_id: CYCLE-YYYY-MM-DD-<topic>
wave_id: <id>
qa_tier: Q0 | Q1 | Q2 | Q3
qa_batch: solo | wave:<id>
q2_class: ROUTING_SMOKE | PRODUCT_SPOT | MEASURE_FULL | n/a
stages_covered: []
bake_policy: none | verify_sha | rebake_if_source_changed
independence_mode: verify_claims | full_rebuild
run_class: INVALID_ENVIRONMENT_RUN | PRODUCT_FAILURE_RUN | PRODUCT_PASS_RUN | N/A
attempt_outcome: PASS | FALSIFIED | NOT_MEASURED
falsifier_measured: true | false
scope: SESSION_ONLY | PRODUCT
probes_recorded: []
environment_fingerprint: <path-or-n/a>
effective_runtime_fingerprint: <path-or-n/a>
product_equivalence: PASS | FAIL | N/A
layer_a: PASS | FAIL | PARTIAL | SKIP
layer_b: PASS | FAIL | PARTIAL | ENV-BROWSER-SKIP | N/A
layer_b_mcp: user-dev-chrome | cursor-ide-browser | none
visual_face_check: PASS | FAIL | PARTIAL | N/A
product_load_crash: OPEN | CLEARED | N/A
metrics: []
evidence_path: <path>
verdict: PASS | PARTIAL | FAIL
blocker: none | "<description>"
next_agent: technical-advisor
```

## 8. Technical-advisor footer

```yaml
agent: technical-advisor
cycle_id: CYCLE-YYYY-MM-DD-<topic>
wave_id: <id>
directive_id: <from strategy> | n/a
routing: DIAGNOSTIC | LEVER | ADVANCE_SHORT | MEASUREMENT_REPAIR | REPORT_UP
log_mode: FULL | ADVANCE_SHORT | REPORT_UP
qa_verdict_accepted: true | false
run_class_accepted: <enum>
attempt_outcome_accepted: PASS | FALSIFIED | NOT_MEASURED
attempt_count_before: <n>
attempt_count_after: <n>
measured_owner: <owner> | UNKNOWN
definition_gate:
  verdict: OK | MEASUREMENT-RISK | DEFINITION-RISK | ARCH-RISK
  action: LEVER_ALLOWED | REPAIR_MEASUREMENT | ESCALATE_STRATEGY | ARG_REVIEW
wave_card_path: <path-or-n/a>
lever_proposed: <one lever> | null
theoretical_upper_bound: "<n unit — same as remaining_gap>" | null
remaining_gap: "<n unit>" | null
ub_closes_gap: true | false | n/a
pe_symptom: "<user-visible failure>" | null
measure_where: NODE | PRODUCT_BROWSER | BOTH | n/a
regression_scope: []
trip_wire: "<stop condition>" | null
technical_report:
  claimed_outcome: "<string>" | null
  raw_evidence_paths: []
  open_gaps: []
  recommendation: APPROVE | REJECT_SELF | NEED_STRATEGY | null
verdict: APPROVE-HANDOFF | BLOCK-DEV | REPORT-UP-STRATEGY | SELF-REPAIR
next_agent: lead-dev | qa-agent | strategy-advisor
campaign_state_patch: none | routing-only
```

## 9. Strategy-advisor footer

```yaml
agent: strategy-advisor
cycle_id: CYCLE-YYYY-MM-DD-<topic>
strategyOutputType: STRATEGY_APPROVE_EXECUTION | STRATEGY_REJECT_AND_DIRECT |
  STRATEGY_HOLD_MEASURE | STRATEGY_AUTHORIZE_PHASE | STRATEGY_CLOSE_CEILING |
  STRATEGY_PO_PACKET
authorized_box: <id> | null
directive_id: <id> | null
team_directive: "<concrete next action for technical/lead/QA>" | null
po_packet_precheck:
  decisive_metrics_measured: true | false | n/a
  product_evidence_supports_claim: true | false | n/a
  run_class_valid_for_product_claim: true | false | n/a
  product_fingerprint_equivalent: true | false | n/a
  open_NOT_MEASURED_on_decision_metric: true | false | n/a
  technical_options_to_PO: false
  result: PASS | FAIL | N/A
model_intended: <slug>
model_actual: <slug-or-auto>
model_fallback: none | peer | down-tier | auto
fallback_reason: null | quota | rate_limit | unavailable | api_error | rejected_slug
architecture_review:
  arg_verdict: PASS | FAIL | NOT_RUN
  product_metric_mapping: OK | WEAK | WRONG
  definition_risk: none | denominator | visual_bar | kpi_contract | ten_foot
independent_evidence_review:
  raw_evidence_paths: []
  own_metrics_or_claims: []
  campaign_goal_check: "<one sentence>"
  team_narrative_challenge: "<at least one disagreement/risk>"
independent_forensic:
  ground_truth: <PE | fixture-source | kpi-contract | n/a>
  own_knockout: "<one number this turn>" | n/a
  layer_a_blind_to: <PE symptom or none or n/a>
  remaining_gap: <n unit or n/a>
  lever_max_effect: <n unit or n/a>
  ub_closes_gap: true | false | n/a
  wait_qa_forbidden: true | false | n/a
  rejected: []
adversarial_note: "<non-empty>"
ceiling_scope:
  arc: <id-or-n/a>
  lever_set: <id-or-n/a>
  product_ceiling_claimed: false | true
verdict: "<one PO-readable line>"
next_agent: technical-advisor | lead-dev | qa-agent | PO-human
```

## 10. Validation

Orchestrator stops when:

- footer missing or enum invalid;
- evidence paths are missing without explanation;
- behavior change has no rollback/regression scope;
- run class or attempt outcome is missing;
- `NOT_MEASURED` increments attempt count;
- product claim lacks runtime fingerprint/Product Evidence;
- strategy review lacks raw evidence or adversarial challenge;
- technical footer sets `next_agent: PO-human`;
- `STRATEGY_PO_PACKET` while `po_packet_precheck.result` is FAIL;
- QA overall PASS while Product Evidence contradicts the claimed product outcome;
- QA is dispatched cold cycles on a new instrument without lead `instrument_verified: non_null_warm_run`;
- a `scope: SESSION_ONLY` verdict is cited as a product seat PASS;
- an intermittent-failure observe wave repeats identical conditions more than once (QA-PROTOCOL §12);
- `STRATEGY_APPROVE_EXECUTION` on a product rem while §4.5 binds and `independent_forensic` is missing, `own_knockout` is copied from Layer A only, or `ub_closes_gap` is not `true`;
- WAVE_CARD product rem with `measure_where: NODE` while `pe_symptom` is visual/kiosk/KPI-on-screen;
- lead footer `self_test_covers_pe_symptom: false` with `verdict: SHIPPED`.
