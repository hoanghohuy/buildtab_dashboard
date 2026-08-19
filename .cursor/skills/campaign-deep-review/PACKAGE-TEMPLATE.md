# Package template — fixed spine

Mọi `review-N/` **cùng tên file bắt buộc**. `deep/` và `99` chỉ theo cổng.

```text
<campaign-draft-folder>/review-N/
  00-README.md
  01-VERDICT.md
  02-FACTS-LEDGER.md
  03-CHALLENGES.md
  04-FINDINGS.md
  05-PO-READOUT.md
  findings.yaml
  deep/                        # optional — theo trigger
    D-WALL-OR-PAYLOAD.md
    D-PE-VISUAL.md
    D-PROCESS.md
    D-LEVER-CHRONOLOGY.md
  99-DIRECTION-DRAFT.md        # optional — cổng PO / DRAFT_AWAIT_PO
```

Cấm đổi tên spine. Cấm thêm `06…08` song song làm “executive thứ hai”.
Nội dung dài → `deep/`, không phá spine.

Không commit dump Excel / ảnh gốc / tile lớn — chỉ bytes + SHA + regenerate path.

---

## Reading order (PO)

```text
01-VERDICT  →  05-PO-READOUT  →  (04-FINDINGS nếu muốn)  →  deep/*  →  99 chỉ nếu đang quyết hướng
```

---

## `00-README.md`

```markdown
# <Campaign> review-N — <một dòng>

**Ngày:** YYYY-MM-DD ~HH:MM
**Loại:** OBSERVATION · không authorize code · không thay SSOT
**Schema:** campaign-deep-review spine v1
**Prior:** review-(N-1) | none

## Absolute bars (binding)

\`\`\`text
<paste từ chỉ thị active>
\`\`\`

## Đọc nhanh

| Ai | Đọc |
|----|-----|
| PO bận | [01-VERDICT](./01-VERDICT.md) → [05-PO-READOUT](./05-PO-READOUT.md) |
| PO / audit | + [04-FINDINGS](./04-FINDINGS.md) · [findings.yaml](./findings.yaml) |
| Đào | [02](./02-FACTS-LEDGER.md) · [03](./03-CHALLENGES.md) · `deep/` |

## Delta vs prior review

| | Prior | Now |
|--|-------|-----|
| Wrong-layer | … | … |
| Top P0 | … | … |
| Absolute | OPEN/… | … |

## Clock snapshot

- Campaign clock / last strategy log: …
- Wave đang chạy: …
- Review DoD: PASS | FAIL (thiếu gì)
```

---

## `01-VERDICT.md` (≤ ~100 dòng)

```markdown
# 01 — Verdict

## Một câu
…

## Absolute Q&A

| Câu hỏi | Trả lời thẳng | Nguồn |
|---------|---------------|-------|
| Absolute đóng chưa? | … | … |
| 10-foot / no-scroll @1080p? | … | … |
| KPI khớp nguồn CDE/ERP? | … | … |
| Kiosk ổn (xoay tab / không blank)? | … | … |
| Đang tối ưu đúng tầng? | YES/NO/UNCLEAR | … |
| Còn đường kỹ thuật? | … | … |

## Top P0 (≤3)

| ID | Finding | PO implication |
|----|---------|----------------|
| F01 | … | … |

## Team seat vs quan sát

| Mục | Team | Review |
|-----|------|--------|
| … | … | … |

## Việc tiếp theo (không authorize)
1. PO trả lời câu hỏi trong 05
2. Nếu pivot → soạn chỉ thị riêng → seat multi-agents
```

---

## `02-FACTS-LEDGER.md`

**Cấm** từ “vì vậy nên…”. Chỉ bảng + path.

### Waves / attempts

| Wave | Host | Binding metric | OFF | ON | Cut% | Falsifier | Outcome | Visual label | Evidence path |
|------|------|----------------|-----|----|------|-----------|---------|--------------|---------------|

### Denominators in play

| Name | Definition | Typical value | = PO bar? |
|------|------------|---------------|-----------|

### Milestone contradictions (if any)

| Ledger | Signal A | Signal B | Path |
|--------|----------|----------|------|

### Artifact / fixture facts (if measured)

| Artifact | Bytes | SHA | Source |
|----------|-------|-----|--------|

### Log range reviewed

`Agents Logs/<from>–<to>` · evidence dirs: `…`

---

## `03-CHALLENGES.md`

### Soft invent scan (S1–S8)

| ID | Result | Evidence / note |
|----|--------|-----------------|
| S1 | hit / miss / n/a | … |
| … | … | … |

### Wrong-layer (bắt buộc)

**Answer:** `YES` | `NO` | `UNCLEAR`

Checklist hits: (liệt kê)
Nếu YES/UNCLEAR + ≥2 hit → code probe summary (`file:line`).

### Other honesty challenges

- PE / visual / mock-as-live: …
- Process / harness: …

---

## `04-FINDINGS.md`

Bảng nổi **≤7** (P0/P1). P2 phụ lục ngắn.

| ID | Sev | Class | Claim bị bác / vấn đề | Why | Evidence | Code | PO implication |
|----|-----|-------|----------------------|-----|----------|------|----------------|

Class ∈ `wrong_layer | soft_invent | pe_honesty | process_hang | metric_swap | residual_open | other`

Đồng bộ 1-1 với `findings.yaml`.

---

## `findings.yaml`

```yaml
schema: campaign-deep-review-findings/v1
review_id: review-N
campaign: …
created: YYYY-MM-DD
wrong_layer: YES|NO|UNCLEAR
prior_review: review-(N-1)|null
findings:
  - id: F01
    severity: P0
    class: wrong_layer
    claim_team_or_meter: "…"
    rejected_because: "…"
    evidence:
      - path: …
        signal: …
    code_confirm:
      path: …
      line: …
      note: …
    po_implication: "…"
```

---

## `05-PO-READOUT.md`

```markdown
# 05 — PO readout

## Ba câu thẳng
1. …
2. …
3. …

## Số đẹp → ý nghĩa thật

| Số / nhãn team | Ý nghĩa thật cho PO |
|----------------|---------------------|

## PO cần quyết (1–3 câu hỏi đóng)

1. …?
2. …
3. …

## Không làm từ review này
- Không coi đây là authorize code
- Không Soft invent Success từ Lighthouse / mock demo
```

---

## `deep/*` (optional)

Mỗi file: mở đầu bằng `Triggered by: F0x (class)` · kết thúc bằng `Backlink: 04-FINDINGS`.
Không lặp lại verdict. Chỉ bằng chứng dài / bảng phụ.

---

## `99-DIRECTION-DRAFT.md` (gated)

```markdown
# 99 — Direction DRAFT

\`\`\`yaml
status: DRAFT_AWAIT_PO
authorizes_code: false
\`\`\`

## DỪNG
## LÀM (hướng · không WAVE_CARD)
## Phép đo PO
## PO cần quyết để SIGNED
```

---

## DoD checklist (copy vào cuối `00` hoặc hand-off)

- [ ] 7 file bắt buộc + `findings.yaml`
- [ ] S1–S8 scan complete
- [ ] Wrong-layer YES|NO|UNCLEAR
- [ ] ≤7 findings nổi · P0 có `po_implication`
- [ ] Prior delta (hoặc first_review)
- [ ] Absolute Q&A trong `01`
- [ ] Không dump lớn trong package
- [ ] `99` absent hoặc DRAFT/PO_REQUESTED rõ
