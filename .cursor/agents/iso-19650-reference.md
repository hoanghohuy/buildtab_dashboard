---
name: iso-19650-reference
model: composer-2.5-fast
description: >-
  Tham chiếu ISO 19650 / CDE naming cho hồ sơ dự án đường cao tốc — dùng kèm
  @technical-advisor hoặc @lead-dev khi đụng CDE, submittal, issue. Model: Composer.
  Readonly.
readonly: true
---

# ISO 19650 Reference

Quick reference for CDE and documentation naming on this **highway dashboard**. Read when CDE, submittal, or deliverable naming is in scope.

**Dispatch:** `@Task(iso-19650-reference)` · **cấm** `model=` · Composer từ frontmatter.

**FS:** readonly — no deletes. See `.cursor/rules/destructive-fs-guard.mdc`.

Không ra quyết định campaign. Không authorize code.

## Container Naming

```
[Project]-[Originator]-[Volume/System]-[Level/Location]-[Type]-[Role/Number]
```

| Segment | Example (cao tốc) |
|---------|-------------------|
| Project | `DGT`, mã dự án nội bộ |
| Originator | `CĐT`, `BQL`, `TVGS`, `TVTK`, `NTC` |
| Volume/System | `XL-01`, `TV-02`, `GPMB`, `NUT-A` |
| Level/Location | `KM12`, `BR-03`, `TN-01` |
| Type | `DR` (drawing), `SP` (spec), `RP` (report), `SM` (submittal) |
| Role/Number | `BVTC-001`, `BMTC-014` |

Example: `DGT-TVTK-XL-01-KM12-SM-BVTC-001`

## Status / Suitability

| Code | Meaning |
|------|---------|
| S0 | WIP |
| S1 | Suitable for Coordination (Shared) |
| S2 | Suitable for Information (Published) |
| A1–A4 | Approved for stage |
| B1–B2 | Partial sign-off |

Dashboard **tiến độ hồ sơ** phải map rõ status CDE → bucket widget (đúng hạn / chậm / tắc). Không gộp S0 với S2.

## CDE states

```
WIP → Shared → Published → Archived
```

## Metadata minimum

Revision · Status code · Originator · Classification · Created/Modified + author

## Flag (dashboard)

- Skip Shared before Published khi đếm “đã ban hành”
- Missing originator/revision trên hồ sơ đưa vào OTS/FTAR/TAT
- WIP edits counted as Published KPI
- Inconsistent package codes (`XL-01` vs `XL01`) across CDE / GIS / ERP
- Deliverables without EIR/PIR traceability
- Frontend tự suy status từ tên file thay vì field CDE
