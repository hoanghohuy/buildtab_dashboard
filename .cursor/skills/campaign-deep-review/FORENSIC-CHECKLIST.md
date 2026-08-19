# Forensic checklist — campaign deep review

Dùng ở **R3–R4**. Kết quả ghi vào `03-CHALLENGES.md` + nuôi `04-FINDINGS` / `findings.yaml`.

---

## 1. Soft invent scan (bắt buộc đủ S1–S8)

| ID | Claim hay gặp | Hỏi / bác bằng gì | Result |
|----|---------------|-------------------|--------|
| S1 | Lighthouse / TTI / FPS = product PASS | 10-foot screenshot @1080p? Font ≥18px? No-scroll? | hit/miss/n/a |
| S2 | Mock / faker = live CDE/ERP | `data_arm` + source SHA? Nhãn nguồn trên UI? | |
| S3 | Màu widget / status heuristic = KPI PASS | Số trên màn vs fixture/công thức BFF? | |
| S4 | QA NO_REPRO = residual closed | Intermittent + PO unrebutted? | |
| S5 | API 200 / `product_equivalence: PASS` = UX PO | Viewport TV? Kiosk vs desktop? Flag soup? | |
| S6 | Chart đẹp hơn / thêm widget = tiến sản phẩm | Cùng metric + fingerprint? Vượt 9 widget/tab? | |
| S7 | Soft Success / Ceiling / ACCEPT residual = đóng absolute | Absolute bars trong chỉ thị còn OPEN? | |
| S8 | Smoke screenshot = kiosk-ready 24/7 | Rubric 10-foot + stale/offline + rotation? | |

Mỗi **hit** → tối thiểu 1 finding `class: soft_invent` (hoặc gộp nếu cùng gốc).
Scan **complete** chỉ khi cả 8 dòng có result (không bỏ trống).

---

## 2. Wrong-layer (câu bắt buộc mọi review)

> **Are we optimizing the wrong layer?** → `YES` | `NO` | `UNCLEAR`

Tầng điển hình Dashboard: `source-sync` → `bff-kpi` → `tab-payload` → `widget-render` → `ten-foot-paint` → `kiosk`.

### Tín hiệu (hit nếu đúng)

- [ ] W1 ≥3 lever **cùng class CSS/animation/glass** FALSIFIED trong khi KPI/ETL còn OPEN
- [ ] W2 Frontend **tự tính KPI** (vi phạm BFF contract)
- [ ] W3 Polish widget khi owner đo được là ETL/CDE adapter
- [ ] W4 Owner % **flip mạnh** khi đổi denominator (OTS vs TAT vs FTAR vs % khối lượng)
- [ ] W5 Mock fixture được gắn nhãn live / product-default
- [ ] W6 Perf budget PASS, 10-foot FAIL (font < 18px, scroll, >9 widget)
- [ ] W7 Baseline wall tụt trên **OFF** arm bị gán credit lever
- [ ] W8 Nhiều PASS meter / FAIL mắt PO trên TV (hoặc ngược) trên cùng fixture

**Quy tắc trả lời:**

| Hits | Answer mặc định |
|------|-----------------|
| ≥2 | `YES` hoặc `UNCLEAR` (không được `NO` trừ khi code bác) |
| 1 | `UNCLEAR` |
| 0 | `NO` (vẫn ghi đã quét) |

### Code probe (bắt buộc nếu answer ≠ NO)

1. KPI formula + BFF DTO (`file:line`)
2. SWR key / refresh vs `generatedAt`
3. Grid overflow @1920×1080
4. Flag defaults product-default ON/OFF (kiosk, mock, perf-mode)
5. Ghi `file:line`

---

## 3. Wall / metric honesty

| Check | Tín hiệu xấu → class gợi ý |
|-------|----------------------------|
| Đổi denominator im lặng (OTS↔TAT) | `metric_swap` |
| FE format số khác BFF | `metric_swap` / `wrong_layer` |
| Coverage 100% hồ sơ = “đúng hạn dự án” | Soft invent |
| Mock 200 OK spend như LIVE PASS | `process_hang` / Soft invent |

Ghi vào Facts trước; Challenge chỉ trích mâu thuẫn.

---

## 4. PE / visual honesty

| Check | Tín hiệu xấu |
|-------|----------------|
| Lighthouse PASS, screenshot cuộn | `pe_honesty` |
| `visual_face_check` absent suốt layout grind | `pe_honesty` |
| Chỉ smoke 1 tab, claim 4 tab kiosk | `pe_honesty` |
| Font token đúng, computed style < 18px | `pe_honesty` |
| Blank TV khi stale — không badge | `pe_honesty` |

---

## 5. Process / harness

| Check | Class |
|-------|-------|
| Hang recover > học falsifier | `process_hang` |
| `flag_ok=False` vẫn burn rem | `process_hang` |
| Viewport laptop dùng cho claim TV | Soft invent + process |
| Duplicate log numbers | `process_hang` |
| Đẩy Option A/B/C lên PO | process + governance note |
| Task 24h soak kiosk | `process_hang` (dùng job ngoài vòng Task) |

---

## 6. Absolute still open? (cho `01-VERDICT`)

| Câu hỏi | Trả lời bằng |
|---------|--------------|
| 10-foot practical? | Screenshot 1080p + rubric — không Lighthouse đơn |
| KPI practical? | Số trên màn vs fixture/công thức — không API 200 |
| Kiosk? | Xoay tab + không blank — không “timer code có” |
| Còn đường? | Wrong-layer còn mở? LARGE/BFF/ETL UB? |

**Cấm** “hết đường” chỉ vì CSS/animation lever exhausted.
