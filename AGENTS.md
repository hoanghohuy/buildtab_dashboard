# Agents — Executive Dashboard

Repo greenfield: dashboard điều hành dự án đường cao tốc (TV 10-foot, KPI từ CDE/ERP).

## North Star (rút gọn)

- Overview, không deep-dive. TV 1920×1080 là màn chính — không cuộn, font ≥ 18px.
- KPI tính ở BFF. Mock ≠ live. Research ≠ authorize.
- Chi tiết: `.cursor/rules/dashboard-greenfield.mdc`

## Multi-agent

Skill: `.cursor/skills/multi-agents/SKILL.md` (gọi tường minh `@multi-agents`).

| Agent | Việc |
|-------|------|
| `orchestrator-router` | Điều phối, preflight, chặn sai kênh PO |
| `strategy-advisor` | PO-proxy, authorize/đóng box, gói PO |
| `technical-advisor` | Một `WAVE_CARD`, report-up |
| `lead-dev` | Một lever, self-test, không claim product PASS |
| `qa-agent` | Đo độc lập; Product Evidence phủ quyết Layer A |
| `iso-19650-reference` | Đặt tên CDE/hồ sơ — không quyết campaign |

Dispatch tactial: **không** truyền `model=`. Strategy dùng ladder trong `STRATEGY-AND-GOVERNANCE.md`.

## Deep review

Skill: `.cursor/skills/campaign-deep-review/SKILL.md` — gói observation `review-N`, không authorize code.

## Campaign SSOT

`Documents/1-Sprints/<Campaign>/CAMPAIGN-STATE.md`

Draft hiện tại: `0 - Documents/1 - ThaoLuan/V0/`
