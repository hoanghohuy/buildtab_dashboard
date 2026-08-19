---
name: campaign-deep-review
description: >-
  Produces PO observation review packages (review-N) with a fixed spine
  (Verdict → Facts → Challenges → Findings → PO readout), forensic-reading
  evidence/logs/(optional) code to surface wrong-layer and Soft-invent problems
  before PO reads. Use when the user asks for deep review, review-N package,
  evidence/log forensic audit, or “rà hiện trạng rồi mới đọc”.
disable-model-invocation: true
---

# Campaign deep review

Gói **observation** cho PO đọc **sau**. Mục tiêu: phát hiện Soft invent / sai tầng / lệch bar — không viết lại nhật ký team.

```yaml
authority: OBSERVATION_REVIEW_PACKAGE
authorizes_code: false
replaces_campaign_ssot: false
may_write_direction_draft: only_if_PO_asks_OR_explicit_DRAFT_AWAIT_PO
```

**Không** thay `@multi-agents`. **Không** sửa `CAMPAIGN-STATE` / `PO/*` từ skill này.

---

## 1. Khung hiệu quả

Review-N hữu ích nhưng **không cùng khung** → khó so sánh. Skill này khóa **một xương sống cố định**:

```text
VERDICT (PO 1 trang)
  ↑ từ
FINDINGS (xếp hạng · có ID · có rejected claim)
  ↑ từ
CHALLENGES (ép Soft invent + wrong-layer + honesty)
  ↑ từ
FACTS LEDGER (bảng thô · chưa diễn giải)
  ↑ từ
raw evidence → logs → state → (code nếu R4 hit)
```

| Nguyên tắc | Ý nghĩa |
|------------|---------|
| **Spine cố định** | Mọi `review-N` cùng tên file bắt buộc → so sánh N vs N−1 |
| **Tách lớp** | Facts ≠ Challenges ≠ Findings ≠ Direction |
| **Ép săn sai tầng** | Mọi review phải trả lời: *đang tối ưu đúng tầng chưa?* (BFF/KPI vs CSS vs ETL) |
| **Deep theo trigger** | Không viết file “cho đủ”; `deep/` chỉ khi finding cần |
| **DoD review** | Thiếu DoD = package chưa xong |
| **PO path ngắn** | PO đọc `01` → `05`; đào `04`/`deep/` chỉ khi cần |
| **Direction có cổng** | Không tự kê đơn trừ PO xin hoặc `DRAFT_AWAIT_PO` |

Chi tiết file: [PACKAGE-TEMPLATE.md](PACKAGE-TEMPLATE.md)  
Checklist săn: [FORENSIC-CHECKLIST.md](FORENSIC-CHECKLIST.md)

---

## 2. When / when-not

**Chạy khi** PO gọi tường minh (“review-3”, “deep review trước khi tôi đọc”, “rà evidence như forensic”).

**Không chạy** giữa lead/QA cold đang đo — nhiễu SSOT, ROI thấp.

**Gợi ý ROI cao:** sau arc FALSIFIED/Ceiling dài · meter vs mắt lệch trên TV · team nói “hết đường” · trước khi ký chỉ thị lớn.

---

## 3. Inputs & đọc

| # | Nguồn | Bắt buộc |
|---|--------|----------|
| 1 | `CAMPAIGN-STATE.md` | Yes |
| 2 | `Agents Logs/` (20–40 mới nhất + strategy/QA gắn evidence) | Yes |
| 3 | `evidence/**` (`qa-result.json`, ledger, PE, screenshot 1080p) | Yes |
| 4 | Chỉ thị active + standing PO constraints | Yes nếu có |
| 5 | `review-(N-1)/` `01` + `04` + `findings.yaml` | Yes nếu tồn tại |
| 6 | Code / fixture snapshot | Chỉ khi wrong-layer trigger |

**Thứ tự:** raw evidence → log narrative → CAMPAIGN-STATE. Cấm kết luận chỉ từ log.

---

## 4. Workflow (bắt buộc)

```text
Review Progress:
- [ ] R0 Scope + DoD blank + folder review-N
- [ ] R1 Inventory (evidence dirs · log range · prior review delta seed)
- [ ] R2 FACTS ledger (bảng thô — chưa diễn giải)
- [ ] R3 CHALLENGES (≥3 Soft invent quét + wrong-layer bắt buộc trả lời)
- [ ] R4 Code probe nếu wrong-layer ≥2 tín hiệu
- [ ] R5 FINDINGS.md + findings.yaml (P0 trước · max 7 findings nổi)
- [ ] R6 deep/* chỉ theo trigger class
- [ ] R7 01-VERDICT + 05-PO-READOUT + 00-README
- [ ] R8 Working-log tip observation only
- [ ] R9 DoD gate → hand-off PO
```

### R0 — Scope

- Path: `Documents/0-Draft/.../<campaign-folder>/review-N/` (N = max+1 trừ PO đặt tên)
- Ghi: campaign · fixture · host bar (product-default vs flag soup · live vs mock) · absolute bars · clock log#

### R2 — Facts (cấm diễn giải)

Mỗi wave/evidence quan trọng ≥1 hàng:

`wave | host | metric_binding | off | on | cut% | falsifier | outcome | visual_label | path`

Plus bảng **denominator** (OTS vs TAT vs FTAR vs giải ngân) và **milestone mâu thuẫn** nếu có.

### R3 — Challenges (ép)

1. Quét Soft invent S1–S8 ([FORENSIC-CHECKLIST.md](FORENSIC-CHECKLIST.md)) — ghi đã quét / hit / miss
2. Trả lời **câu bắt buộc**: *Are we optimizing the wrong layer?* → YES / NO / UNCLEAR + tín hiệu
3. ≥1 challenge PE/visual honesty nếu có nhãn Lighthouse / no-repro / smoke / mock-as-live

### R4 — Code probe

Khi wrong-layer checklist ≥2 hit → đọc code/fixture **read-only**: KPI formula · BFF payload · flag defaults. Ghi `file:line`.

### R5 — Findings

Schema bắt buộc trong `findings.yaml` + bảng người đọc trong `04-FINDINGS.md`.
**Max 7 findings** trong bảng nổi (P0/P1); phần còn lại `severity: P2` phụ lục.
Mỗi finding P0 phải có `po_implication` một câu.

### R6 — deep/ triggers

| Finding class | Mở file deep |
|---------------|--------------|
| `wrong_layer` / `metric_swap` | `deep/D-WALL-OR-PAYLOAD.md` |
| `pe_honesty` / visual | `deep/D-PE-VISUAL.md` |
| `process_hang` / harness | `deep/D-PROCESS.md` |
| Chuỗi lever dài | `deep/D-LEVER-CHRONOLOGY.md` |
| Không có class trên | **Không** tạo deep |

### R7 — Verdict & PO readout

- `01-VERDICT.md`: ≤ ~80–100 dòng · bảng câu hỏi absolute · top ≤3 P0 · một câu tóm tắt
- `05-PO-READOUT.md`: số đẹp vs ý nghĩa · **quyết định PO phải trả lời** (1–3 câu hỏi) · **không** danh sách code task

### R9 — DoD gate (package chưa xong nếu thiếu)

```yaml
review_dod:
  files_mandatory: [00-README, 01-VERDICT, 02-FACTS-LEDGER, 03-CHALLENGES, 04-FINDINGS, 05-PO-READOUT, findings.yaml]
  soft_invent_scan: complete
  wrong_layer_answer: YES|NO|UNCLEAR
  findings_count_highlighted: "1..7"
  prior_review_delta: present|first_review
  absolute_bars_answered: true
  no_bin_committed: true
  direction_file: absent|DRAFT_AWAIT_PO|PO_REQUESTED
```

Hand-off:

```text
review-N: <path>
P0: (1)… (2)… (3)…
Wrong-layer: YES|NO|UNCLEAR
Đọc: 01 → 05; đào 04/deep khi cần.
Observation only — chưa authorize / chưa chỉ thị.
PO cần trả lời: <câu trong 05>
```

---

## 5. Forbidden

- Trộn Facts với kiến nghị trong `02`
- Soft invent Success/Visual từ Lighthouse/TTI
- Narrative log thắng raw JSON / screenshot
- Viết `99-DIRECTION` như đã authorize
- Spine tùy biến đổi tên file bắt buộc
- Deep “cho đủ bộ” khi không có trigger
- Commit dump Excel / ảnh gốc / tile lớn vào review
- Thay multi-agents / sửa CAMPAIGN-STATE

---

## 6. Timebox

| | |
|--|--|
| Soft | 45–90 phút wall tới DoD |
| Hard | Nếu quá giờ: ship package với gap `NOT_MEASURED` / `UNCLEAR` ghi rõ — **cấm** bịa finding |

---

## 7. Direction (cổng riêng)

- Mặc định: **không** có `99-DIRECTION-DRAFT.md`
- Chỉ tạo khi PO xin sau khi đọc, hoặc PO nói trước “kèm draft hướng” → file phải ghi `status: DRAFT_AWAIT_PO`
- Nội dung: DỪNG / LÀM / phép đo PO / việc PO quyết — **không** WAVE_CARD

---

## 8. Progressive disclosure

| File | Đọc khi |
|------|---------|
| [PACKAGE-TEMPLATE.md](PACKAGE-TEMPLATE.md) | Viết file · skeleton · findings.yaml |
| [FORENSIC-CHECKLIST.md](FORENSIC-CHECKLIST.md) | R3–R4 săn Soft invent / wrong-layer / PE |
