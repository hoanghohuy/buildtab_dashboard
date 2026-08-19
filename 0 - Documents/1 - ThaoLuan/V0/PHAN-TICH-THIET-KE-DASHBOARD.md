# BÁO CÁO PHÂN TÍCH & ĐỀ XUẤT THIẾT KẾ
## Executive Dashboard — Dự án Đường cao tốc

| Thuộc tính | Giá trị |
|---|---|
| Phiên bản | V0 (Draft for discussion) |
| Ngày | 19/08/2026 |
| Phạm vi | Phân tích nghiệp vụ, bộ chỉ số, thiết kế UI/UX, kiến trúc kỹ thuật |
| Đối tượng đọc | Ban lãnh đạo, Ban QLDA, Product Owner, Team phát triển |
| Trạng thái | Chờ thống nhất trước khi vào giai đoạn wireframe chi tiết |

---

## MỤC LỤC

1. [Bối cảnh & Mục tiêu](#1-bối-cảnh--mục-tiêu)
2. [Phân tích người dùng & ngữ cảnh sử dụng](#2-phân-tích-người-dùng--ngữ-cảnh-sử-dụng)
3. [Nguyên tắc thiết kế cho màn hình lớn (10-foot UI)](#3-nguyên-tắc-thiết-kế-cho-màn-hình-lớn-10-foot-ui)
4. [Kiến trúc thông tin (Information Architecture)](#4-kiến-trúc-thông-tin-information-architecture)
5. [Bộ chỉ số KPI — phân tích & đề xuất bổ sung](#5-bộ-chỉ-số-kpi--phân-tích--đề-xuất-bổ-sung)
6. [Tab 1 — Tổng quan](#6-tab-1--tổng-quan)
7. [Tab 2 — Org Chart](#7-tab-2--org-chart)
8. [Tab 3 — Tài chính](#8-tab-3--tài-chính)
9. [Tab 4 — Sức khỏe Nhà thầu / Tư vấn](#9-tab-4--sức-khỏe-nhà-thầu--tư-vấn)
10. [Hệ thống thiết kế (Design System) — Dark + Glassmorphism](#10-hệ-thống-thiết-kế-design-system--dark--glassmorphism)
11. [Kiến trúc kỹ thuật & Tech Stack](#11-kiến-trúc-kỹ-thuật--tech-stack)
12. [Mô hình dữ liệu & API Contract](#12-mô-hình-dữ-liệu--api-contract)
13. [Chế độ Kiosk / TV Mode](#13-chế-độ-kiosk--tv-mode)
14. [Lộ trình triển khai](#14-lộ-trình-triển-khai)
15. [Rủi ro & Khuyến nghị](#15-rủi-ro--khuyến-nghị)
16. [Danh sách câu hỏi cần chốt](#16-danh-sách-câu-hỏi-cần-chốt)

---

## 1. Bối cảnh & Mục tiêu

### 1.1 Bối cảnh

Dự án đường cao tốc là dạng dự án **hạ tầng tuyến tính (linear infrastructure)** với các đặc thù:

- **Trải dài theo tuyến**: hàng chục đến hàng trăm km, chia thành nhiều **cụm dự án / dự án thành phần / gói thầu** → bản đồ GIS là công cụ điều hướng tự nhiên nhất, không phải bảng biểu.
- **Nhiều bên tham gia**: Chủ đầu tư, Ban QLDA, TVGS, TVTK, TV thẩm tra, Nhà thầu chính, thầu phụ, đơn vị GPMB, địa phương → cần org chart và bảng xếp hạng năng lực.
- **Luồng hồ sơ (submittal) là "mạch máu"**: tiến độ thi công thường bị chặn bởi tiến độ hồ sơ (BVTC, biện pháp thi công, vật liệu, nghiệm thu). Đây chính là lý do dashboard lấy **tiến độ hồ sơ** làm trục chính — đây là lựa chọn đúng và là **leading indicator** (chỉ số dẫn báo) tốt hơn nhiều so với % khối lượng.
- **CDE (Common Data Environment)** theo ISO 19650 đang là nguồn dữ liệu chuẩn cho hồ sơ và issue.

### 1.2 Mục tiêu sản phẩm

| # | Mục tiêu | Tiêu chí thành công |
|---|---|---|
| M1 | Lãnh đạo nắm tình hình dự án trong **< 30 giây** nhìn màn hình | Mỗi tab trả lời được câu hỏi "Có vấn đề gì không? Ở đâu? Ai chịu trách nhiệm?" |
| M2 | Phát hiện sớm điểm nghẽn trước khi thành sự cố | Có cơ chế cảnh báo màu + xếp hạng Top N chậm trễ |
| M3 | Một nguồn sự thật duy nhất (single source of truth) | Dữ liệu đồng bộ tự động từ CDE / ERP, có timestamp cập nhật |
| M4 | Hiển thị liên tục 24/7 trên TV phòng điều hành | Không cần thao tác, tự xoay tab, tự làm mới, không memory leak |
| M5 | Dùng được trên tablet khi đi hiện trường / họp | Responsive landscape, tối ưu chạm |

### 1.3 Nguyên tắc cốt lõi: **"Overview, không Deep-dive"**

> Dashboard này **không phải** hệ thống quản lý. Nó là **kính viễn vọng**, không phải kính hiển vi.

Quy tắc áp dụng xuyên suốt:

- Mỗi widget trả lời **đúng 1 câu hỏi** của lãnh đạo.
- Không hiển thị bảng > 8 dòng. Luôn dùng **Top N** (N = 5 hoặc 7).
- Mọi con số phải kèm **ngữ cảnh**: so với kế hoạch, so với kỳ trước, hoặc so với ngưỡng.
- Không có số nào đứng trơ trọi mà không có màu trạng thái hoặc mũi tên xu hướng.
- Chi tiết (drill-down) là **tùy chọn**, mở dạng modal/drawer, không phải luồng chính.

---

## 2. Phân tích người dùng & ngữ cảnh sử dụng

### 2.1 Chân dung người dùng

| Persona | Vai trò | Câu hỏi thường trực | Tab quan tâm |
|---|---|---|---|
| **P1 — Lãnh đạo cấp cao** (Chủ tịch/TGĐ/Thứ trưởng khi thị sát) | Xem lướt, ra quyết định nguồn lực | "Dự án có về đích đúng hạn không? Tiền đi đâu?" | Tab 1, Tab 3 |
| **P2 — Giám đốc Ban QLDA** | Điều hành hằng ngày | "Gói nào đang chậm? Đơn vị nào cần nhắc?" | Tab 1, Tab 4 |
| **P3 — Trưởng phòng Kỹ thuật / Điều hành dự án** | Xử lý điểm nghẽn | "Hồ sơ nào tắc? Rủi ro nào leo thang?" | Tab 1, Tab 4 |
| **P4 — Trưởng phòng Tài chính - Kế hoạch** | Giải ngân, kế hoạch vốn | "Giải ngân đạt bao nhiêu % kế hoạch năm?" | Tab 3 |
| **P5 — Khách tham quan / Đoàn kiểm tra** | Ấn tượng tổng thể | "Dự án trông thế nào?" | Tab 1 (chế độ trình chiếu) |

### 2.2 Ngữ cảnh hiển thị (Display Context)

| Thiết bị | Độ phân giải mục tiêu | Khoảng cách xem | Chế độ | Ghi chú |
|---|---|---|---|---|
| **TV phòng điều hành** | 1920×1080 (FHD) hoặc 3840×2160 (4K, scale 2×) | 2.5 – 5 m | Kiosk, không tương tác, auto-rotate tab | **Ưu tiên số 1** |
| **Video wall** (2×2 hoặc 3×3) | 3840×2160+ | 4 – 8 m | Kiosk, mỗi màn 1 tab cố định | Giai đoạn 2 |
| **Tablet 10–13"** landscape | 1024×768 → 2732×2048 | 40 – 60 cm | Tương tác chạm, cho phép cuộn nhẹ | Ưu tiên số 2 |
| **Laptop / họp giao ban** | 1440×900 → 1920×1080 | 60 – 80 cm | Tương tác đầy đủ, có drill-down | Ưu tiên số 3 |

> **Quyết định thiết kế**: Lấy **1920×1080 làm khung xương chuẩn (design baseline)**, các độ phân giải khác dùng cơ chế **scale theo tỷ lệ** (CSS `clamp()` + container query), không reflow lại layout. Điều này đảm bảo cam kết "không cuộn".

### 2.3 Vì sao chia Tab thay vì cuộn — và cách làm đúng

Chia tab là quyết định đúng, nhưng cần bổ sung 3 cơ chế để tránh nhược điểm "mất ngữ cảnh":

1. **Thanh KPI toàn cục cố định** (Global KPI Strip) xuất hiện ở **mọi tab** — 4–6 chỉ số sống còn luôn hiện diện.
2. **Auto-rotate**: tự chuyển tab sau N giây (mặc định 45s), có thanh progress mảnh phía dưới tab bar để người xem biết sắp chuyển.
3. **Chỉ báo cảnh báo trên tab**: nếu tab nào có mục cần chú ý → badge đỏ/vàng ngay trên nhãn tab.

---

## 3. Nguyên tắc thiết kế cho màn hình lớn (10-foot UI)

### 3.1 Quy tắc kích thước chữ

Công thức tối thiểu: **chiều cao chữ ≥ khoảng cách xem / 150**.

| Khoảng cách xem | Cỡ chữ nhỏ nhất | Áp dụng cho |
|---|---|---|
| 3 m | 20 px @1080p | Nhãn phụ, đơn vị đo |
| 4 m | 26 px | Text nội dung, tên gói thầu |
| 5 m | 34 px | Tiêu đề widget |
| — | 56 – 96 px | Số liệu KPI chính |

**Thang typography đề xuất (@1920×1080):**

| Token | Size / Line-height | Weight | Dùng cho |
|---|---|---|---|
| `display-xl` | 88 / 92 | 700 | Số KPI chính trong strip |
| `display-lg` | 64 / 68 | 700 | Số lớn trong widget |
| `heading-md` | 32 / 40 | 600 | Tiêu đề widget |
| `body-lg` | 24 / 32 | 500 | Nội dung bảng, tên đơn vị |
| `body-md` | 20 / 28 | 400 | Nhãn trục biểu đồ |
| `caption` | 18 / 24 | 500 | Đơn vị, chú thích, timestamp |

> ⚠️ **Không dùng cỡ chữ < 18px** ở bất kỳ đâu trên chế độ TV, kể cả legend biểu đồ.

### 3.2 Mật độ thông tin

| Nguyên tắc | Chi tiết |
|---|---|
| **Tối đa 9 widget/tab** | Vượt quá 9 → mắt không quét kịp trong 30s |
| **Tối đa 5 màu dữ liệu/biểu đồ** | Nhiều hơn thì dùng nhóm "Khác" |
| **Tối đa 3 series/line chart** | Baseline + Actual + Forecast là đủ |
| **Top 5, không Top 10** | Trên TV, Top 5 đọc được; Top 10 thành nhiễu |
| **Tỷ lệ trắng (whitespace) ≥ 30%** | Glassmorphism cần khoảng thở mới đẹp |

### 3.3 Hệ thống lưới (Grid System)

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER  (72px)  — Logo · Tên dự án · Tab Nav · Đồng hồ · Data status │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   CONTENT GRID:  12 cột  ×  9 hàng                                   │
│   • Padding ngoài : 24 px                                            │
│   • Gutter        : 14 px                                            │
│   • Chiều rộng cột: (1920 − 48 − 11×14) / 12 = 143 px                │
│   • Chiều cao hàng: (1080 − 48 − 72 − 8×14) / 9  = 96 px             │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

Mọi widget định nghĩa bằng `{ colStart, colSpan, rowStart, rowSpan }` → dễ cấu hình, dễ đổi bố cục mà không sửa code.

### 3.4 Quét mắt (Visual Hierarchy)

Người xem quét theo hình chữ **Z** (hoặc **F** với người đọc kỹ). Bố trí theo mức độ quan trọng:

```
   ┌─── ĐỘ ƯU TIÊN GIẢM DẦN ───┐
   ①  ────────────►  ②          Vùng ① : Trên-trái  = QUAN TRỌNG NHẤT
       ╲                        Vùng ② : Trên-phải
        ╲                       Vùng ③ : Dưới-trái
         ╲                      Vùng ④ : Dưới-phải  = BỔ TRỢ
   ③  ────────────►  ④
```

---

## 4. Kiến trúc thông tin (Information Architecture)

### 4.1 Sitemap

```
DASHBOARD CAO TỐC
│
├── [Global] Header  ── Tên dự án · Tab nav · Đồng hồ · Trạng thái dữ liệu · Nút Fullscreen
├── [Global] KPI Strip ── 6 chỉ số sống còn (hiện ở mọi tab)
│
├── TAB 1 · TỔNG QUAN            ← Mặc định, thời lượng auto-rotate 60s
│     ├── Bản đồ GIS tuyến  (+ overlay Thông tin dự án)
│     ├── S-Curve tiến độ hồ sơ (Baseline / Actual / Forecast)
│     ├── Album ảnh công trường
│     ├── Top 5 gói thầu chậm hồ sơ
│     ├── Bảng xếp hạng đơn vị (segmented: TVTK ⇄ Nhà thầu)
│     ├── Top 5 rủi ro (từ CDE Issues) + Ma trận rủi ro
│     └── Dải mốc tiến độ / Lịch sự kiện
│
├── TAB 2 · SƠ ĐỒ TỔ CHỨC        ← 40s
│     ├── Cây điều hướng cụm dự án
│     ├── Canvas Org Tree (Cụm → Vai trò → Đơn vị → Đầu mối)
│     └── Panel chi tiết đơn vị (khi chọn)
│
├── TAB 3 · TÀI CHÍNH            ← 45s
│     ├── Waterfall dòng tiền TMĐT → Giải ngân
│     ├── S-Curve giải ngân (KH năm vs Thực tế vs Dự báo)
│     ├── Cơ cấu chi phí (Treemap / Donut)
│     ├── Bảng gói thầu — giá trị & thanh toán
│     ├── Phát sinh & Điều chỉnh (VO)
│     └── Giải ngân theo nguồn vốn / theo tháng
│
└── TAB 4 · SỨC KHỎE NHÀ THẦU / TƯ VẤN   ← 45s
      ├── Radar so sánh đa tiêu chí
      ├── Ma trận Khối lượng × Điểm sức khỏe (Bubble)
      ├── Heatmap Tiêu chí × Đơn vị
      ├── Bảng Scorecard xếp hạng
      └── Cảnh báo sớm & Khuyến nghị hành động
```

### 4.2 Đề xuất tab mở rộng (giai đoạn sau)

| Tab đề xuất | Lý do | Ưu tiên |
|---|---|---|
| **Tiến độ thi công** | Hiện dashboard mới có tiến độ *hồ sơ*. Lãnh đạo sẽ hỏi ngay "còn thi công thì sao?" — S-curve khối lượng, sản lượng theo hạng mục (nền, móng, mặt, cầu, hầm, ATGT) | ⭐⭐⭐ Cao |
| **GPMB & Mặt bằng** | Với cao tốc VN, GPMB là nút thắt số 1. % mặt bằng bàn giao theo km, số hộ chưa di dời, di dời hạ tầng kỹ thuật | ⭐⭐⭐ Cao |
| **An toàn – Chất lượng – Môi trường (HSE/QA)** | Chỉ số bắt buộc báo cáo, hiện đang thiếu | ⭐⭐ Trung bình |
| **Vật liệu & Thiết bị** | Mỏ vật liệu, trữ lượng, cự ly vận chuyển, huy động thiết bị | ⭐⭐ Trung bình |
| **Digital Twin / BIM 3D** | Trình chiếu mô hình khi tiếp đoàn | ⭐ Thấp (nhưng "wow factor" cao) |

> **Khuyến nghị**: Giữ 4 tab ở V1. Thiết kế thanh tab **có thể mở rộng đến 7 tab** ngay từ đầu (không quá 7 vì vượt giới hạn trí nhớ ngắn hạn).

---

## 5. Bộ chỉ số KPI — phân tích & đề xuất bổ sung

### 5.1 Global KPI Strip — 6 chỉ số sống còn

Đây là 6 con số lãnh đạo cần thấy **mọi lúc, ở mọi tab**:

| # | Chỉ số | Công thức | Hiển thị | Ngưỡng màu |
|---|---|---|---|---|
| 1 | **Tiến độ tổng thể** | `% khối lượng thực hiện` + so sánh baseline | `62.4%` + delta `−3.1%` vs KH | ≥ KH: xanh · −5%..0: vàng · < −5%: đỏ |
| 2 | **SPI** (Schedule Performance Index) | `EV / PV` | `0.94` | ≥0.95 xanh · 0.85–0.95 vàng · <0.85 đỏ |
| 3 | **Giải ngân** | `Đã giải ngân / KH vốn năm` | `48.2%` + `1.842 tỷ` | So với % thời gian đã trôi của năm |
| 4 | **Hồ sơ đúng hạn** | `HS nộp đúng hạn / Tổng HS đến hạn` | `76%` | ≥90 xanh · 75–90 vàng · <75 đỏ |
| 5 | **Rủi ro nghiêm trọng** | `COUNT(risk WHERE level ∈ {High, Critical} AND status = Open)` | `7` mục | 0 xanh · 1–3 vàng · >3 đỏ |
| 6 | **Ngày đến mốc kế tiếp** | `nextMilestone.date − today` | `D−42` · Thông xe kỹ thuật | <0 đỏ (trễ mốc) |

> **Lưu ý thiết kế**: mỗi ô KPI gồm 4 lớp thông tin — ① Nhãn · ② Số lớn · ③ Delta + mũi tên · ④ Sparkline 12 kỳ gần nhất (mảnh, mờ, nằm dưới đáy ô).

### 5.2 Nhóm chỉ số Tiến độ hồ sơ (mở rộng cho widget 1.2)

Bộ chỉ số hiện tại của bạn (`số hồ sơ nộp được / số hồ sơ phải nộp`) là **tốt nhưng chưa đủ**. Vấn đề: một đơn vị có thể nộp đủ 100% hồ sơ nhưng bị trả lại hết → nhìn thì đẹp mà thực chất tắc.

**Đề xuất bổ sung 5 chỉ số:**

| Chỉ số | Ký hiệu | Công thức | Ý nghĩa với lãnh đạo |
|---|---|---|---|
| **Tỷ lệ nộp đúng hạn** | OTS | `HS nộp trước deadline / HS đến hạn` | Đơn vị có kỷ luật thời gian không? |
| **Tỷ lệ duyệt lần đầu** | FTAR | `HS duyệt ở lần trình đầu / Tổng HS được duyệt` | **Chỉ số chất lượng quan trọng nhất.** FTAR thấp = làm ẩu, tốn công cả hai bên |
| **Thời gian xử lý bình quân** | TAT | `AVG(ngày duyệt − ngày nhận)` — tách riêng cho **bên nộp** và **bên duyệt** | Chỉ đích danh ai làm chậm: nhà thầu hay chủ đầu tư/TVGS |
| **Số vòng lặp bình quân** | REV | `AVG(số lần trình lại / hồ sơ)` | > 2.5 là báo động |
| **Tồn đọng theo tuổi** | AGE | Phân nhóm HS quá hạn: `0–7 / 8–15 / 16–30 / >30 ngày` | Nhìn ra "cục máu đông" |

**Biểu đồ đề xuất cho nhóm này**: Stacked horizontal bar (aging buckets) + KPI FTAR dạng gauge nhỏ.

> 💡 **Insight nghiệp vụ**: TAT tách theo bên là chỉ số "chính trị" quan trọng nhất — nó ngăn tình trạng đổ lỗi qua lại giữa Nhà thầu và Ban QLDA vì có số liệu khách quan.

### 5.3 Nhóm chỉ số Tài chính (mở rộng Tab 3)

| Chỉ số | Công thức | Mức ưu tiên |
|---|---|---|
| **CPI** (Cost Performance Index) | `EV / AC` | ⭐⭐⭐ |
| **EAC** (Ước tính chi phí hoàn thành) | `BAC / CPI` | ⭐⭐⭐ |
| **VAC** (Chênh lệch dự báo) | `BAC − EAC` | ⭐⭐⭐ |
| **Tỷ lệ dự phòng đã dùng** | `Dự phòng đã duyệt / Tổng dự phòng` | ⭐⭐⭐ Cảnh báo sớm vượt TMĐT |
| **Tỷ lệ tạm ứng chưa thu hồi** | `Tạm ứng còn lại / Giá trị HĐ` | ⭐⭐ Rủi ro tài chính với nhà thầu |
| **Tuổi nợ hồ sơ thanh toán** | `AVG(ngày từ khi nộp HS thanh toán → giải ngân)` | ⭐⭐ Ảnh hưởng dòng tiền nhà thầu |
| **Tỷ lệ phát sinh (VO ratio)** | `Σ giá trị VO đã duyệt / Giá trị HĐ gốc` | ⭐⭐⭐ > 10% là cần giải trình |
| **Burn rate** | `Chi phí trung bình/tháng 3 tháng gần nhất` | ⭐⭐ Dự báo cạn vốn |
| **Chênh lệch KH vốn vs Nhu cầu** | `KH vốn giao − Nhu cầu giải ngân dự báo` | ⭐⭐⭐ Cực quan trọng với dự án đầu tư công |

### 5.4 Nhóm chỉ số Sức khỏe đơn vị (Tab 4) — Mô hình chấm điểm

Đề xuất mô hình **6 trụ cột, thang 0–100**:

| Trụ cột | Trọng số | Chỉ số thành phần | Cách chuẩn hóa |
|---|---|---|---|
| **1. Tiến độ** | 30% | SPI gói thầu · % khối lượng vs KH · số mốc trễ | `min(100, SPI × 100)` |
| **2. Hồ sơ & Tuân thủ CDE** | 20% | OTS · FTAR · TAT · số vòng lặp | Trung bình gia quyền 4 chỉ số đã chuẩn hóa |
| **3. Chất lượng** | 20% | Số NCR mở · tỷ lệ nghiệm thu đạt lần đầu · số điểm không phù hợp lặp lại | `100 − (NCR_open × 5)` (sàn 0) |
| **4. An toàn (HSE)** | 15% | LTIFR · số vụ việc · số vi phạm ATLĐ chưa khắc phục · số ngày an toàn | Chuẩn theo ngưỡng ngành |
| **5. Huy động nguồn lực** | 10% | Nhân lực thực tế/cam kết · thiết bị thực tế/cam kết · số mũi thi công | `min(100, tỷ lệ × 100)` |
| **6. Tài chính & Thanh toán** | 5% | Chậm trả thầu phụ · hồ sơ thanh toán sai sót · bảo lãnh còn hiệu lực | Điểm trừ theo sự vụ |

**Công thức tổng:**

```
HealthScore = 0.30·S_progress + 0.20·S_document + 0.20·S_quality
            + 0.15·S_hse     + 0.10·S_resource + 0.05·S_finance
```

**Thang phân loại (Band):**

| Điểm | Nhãn | Màu | Hành động gợi ý |
|---|---|---|---|
| 85 – 100 | Tốt | 🟢 Emerald | Ghi nhận, có thể ưu tiên gói tiếp theo |
| 70 – 84 | Khá | 🔵 Cyan | Theo dõi định kỳ |
| 55 – 69 | Cần theo dõi | 🟡 Amber | Yêu cầu báo cáo khắc phục |
| 40 – 54 | Rủi ro | 🟠 Orange | Họp chấn chỉnh, cảnh báo văn bản |
| < 40 | Nghiêm trọng | 🔴 Rose | Xem xét chế tài / thay thế thầu phụ |

> ⚠️ **Điểm cần thống nhất**: Trọng số phải được Ban lãnh đạo phê duyệt và **công bố cho các đơn vị** — nếu không, bảng xếp hạng sẽ gây tranh cãi. Nên cho phép cấu hình trọng số trong màn hình Admin.

### 5.5 Nhóm chỉ số Rủi ro (widget Top rủi ro)

Nguồn: CDE Issues. Đề xuất chuẩn hóa mỗi issue thành:

```
RiskScore = Likelihood (1–5) × Impact (1–5)   →  1..25
```

| RiskScore | Mức | Màu |
|---|---|---|
| 1 – 4 | Thấp | 🟢 |
| 5 – 9 | Trung bình | 🟡 |
| 10 – 15 | Cao | 🟠 |
| 16 – 25 | Nghiêm trọng | 🔴 |

**Chỉ số bổ sung**: `Risk Ageing` (số ngày rủi ro chưa đóng) và `Risk Trend` (số rủi ro mở mới vs đóng trong 30 ngày) — cho biết đội ngũ đang **kiểm soát** hay **đuối**.

### 5.6 Bảng tổng hợp: nguồn dữ liệu cho từng nhóm chỉ số

| Nhóm chỉ số | Nguồn | Tần suất đồng bộ | Phương thức |
|---|---|---|---|
| Hồ sơ / Submittal / Issue | CDE (ACC, ProjectWise, Trimble Connect…) | 15 phút | REST API + Webhook |
| Tiến độ khối lượng | Primavera P6 / MS Project / Excel Ban QLDA | Hằng ngày | Import XER/XML hoặc API |
| Tài chính, giải ngân | ERP / Phần mềm kế toán / Excel KH-TC | Hằng ngày | API hoặc import Excel có template |
| GIS tuyến, phân đoạn | GeoServer / ArcGIS / Mapbox tileset | Theo thay đổi | WMTS / Vector tiles |
| Ảnh công trường | App hiện trường / Drone / Camera AI | Realtime – 1 giờ | Object storage (S3/MinIO) + metadata |
| HSE, Chất lượng | Biểu mẫu số / App kiểm tra hiện trường | Hằng ngày | API |
| Nhân sự, Org | HRM / Danh bạ dự án | Tuần | API hoặc quản trị nội bộ |

---

## 6. TAB 1 — TỔNG QUAN

### 6.1 Câu hỏi tab này trả lời

> *"Dự án đang ở đâu trên tuyến, tiến độ hồ sơ so với kế hoạch thế nào, ai đang làm chậm, rủi ro gì lớn nhất, và mốc tiếp theo là khi nào?"*

### 6.2 Sơ đồ bố cục (1920×1080 — Grid 12 × 9)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER │ ⬢ Logo  DỰ ÁN CAO TỐC XYZ — GĐ1     [Tổng quan][Org][Tài chính][Sức khỏe] │
│        │                              🕐 15:46  ⟳ Cập nhật 2 phút trước  ⛶        │
├────────────────────────────────────────────────────────────────────────────────────┤
│ R1  ┌──────┬──────┬──────┬──────┬──────┬──────┐                                    │
│     │Tiến độ│ SPI  │Giải  │Hồ sơ │Rủi ro│ Mốc  │   ◄── GLOBAL KPI STRIP (C1–C12)   │
│     │62.4% │ 0.94 │ngân  │đúng  │ng.trọng│ D−42│                                   │
│     │▼3.1% │ ⚠   │48.2% │hạn76%│  7   │      │                                     │
│     └──────┴──────┴──────┴──────┴──────┴──────┘                                    │
├────────────────────────────────────────────┬───────────────────────────────────────┤
│ R2  ╭────────────────────────────────────╮ │ ╭───────────────────────────────────╮ │
│ R3  │  🗺️  BẢN ĐỒ GIS TUYẾN CAO TỐC      │ │ │  📈 TIẾN ĐỘ HỒ SƠ DỰ ÁN           │ │
│ R4  │  (C1–C6, R2–R5)                    │ │ │  (C7–C12, R2–R5)                  │ │
│ R5  │  ┌─ Thông tin dự án ─┐             │ │ │  Baseline ┄┄ · Actual ── · F/C ⋯  │ │
│     │  │ TMĐT: 24.860 tỷ   │             │ │ │  + Bar: số HS nộp trong kỳ        │ │
│     │  │ Khởi công: 01/2024│  ← overlay  │ │ │                                   │ │
│     │  │ Chiều dài: 78,5km │    glass    │ │ │                                   │ │
│     │  └───────────────────┘             │ │ │                                   │ │
│     ╰────────────────────────────────────╯ │ ╰───────────────────────────────────╯ │
├──────────────┬──────────────┬──────────────┼──────────────┬────────────────────────┤
│ R6 ╭────────╮│╭────────────╮│╭────────────╮│╭────────────╮│                        │
│ R7 │📷 ẢNH  ││││🐢 TOP 5    ││││🏆 XẾP HẠNG ││││⚠️ TOP 5    ││                        │
│ R8 │CÔNG    ││││GÓI THẦU    ││││ĐƠN VỊ      ││││RỦI RO      ││                        │
│    │TRƯỜNG  ││││CHẬM HỒ SƠ  ││││[TVTK|N.THẦU]││││+ Ma trận  ││                        │
│    │C1–C3   ││││C4–C6       ││││C7–C9       ││││C10–C12    ││                        │
│    ╰────────╯│╰────────────╯│╰────────────╯│╰────────────╯│                        │
├────────────────────────────────────────────────────────────────────────────────────┤
│ R9  ╭────────────────────────────────────────────────────────────────────────────╮ │
│     │ 🗓️ DẢI MỐC TIẾN ĐỘ  ●──●──◐──○──○──○   (C1–C12)                            │ │
│     ╰────────────────────────────────────────────────────────────────────────────╯ │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Đặc tả chi tiết từng widget

---

#### **W1.1 — Bản đồ GIS tuyến cao tốc**

| Thuộc tính | Giá trị |
|---|---|
| Vị trí | `C1–C6, R2–R5` (858 × 426 px) |
| Loại | Bản đồ tương tác WebGL |
| Thư viện | **MapLibre GL JS** (khuyến nghị) hoặc React-Leaflet nếu nguồn là WMS/ArcGIS |
| Mục đích | Điều hướng không gian + trạng thái tiến độ theo đoạn tuyến |

**Các lớp bản đồ (Layers):**

| Layer | Kiểu | Mã màu | Ghi chú |
|---|---|---|---|
| Nền bản đồ | Raster/Vector tile | Dark theme (Carto Dark Matter / Mapbox Dark) | Bắt buộc dark để hợp tổng thể |
| Tim tuyến (alignment) | LineString, width 6px | Trắng 40% | Đường nền |
| Phân đoạn theo gói thầu | LineString, width 10px | Theo trạng thái tiến độ | **Lớp chính** |
| Công trình đặc biệt | Symbol | Icon cầu 🌉 / hầm / nút giao | Có nhãn khi zoom đủ |
| Vị trí ảnh công trường | Circle + cluster | Cyan phát sáng | Click → mở lightbox |
| Điểm nóng (hotspot) | Pulse marker | Đỏ nhấp nháy chậm | Rủi ro nghiêm trọng / GPMB vướng |
| Ranh GPMB | Polygon fill 20% | Xanh (đã bàn giao) / Đỏ (chưa) | Layer bật/tắt |
| Cột Km | Text label | Trắng 60% | Mỗi 5 km |

**Bảng mã màu trạng thái đoạn tuyến:**

| Trạng thái | Màu | Điều kiện |
|---|---|---|
| Vượt tiến độ | `#34D399` Emerald | SPI ≥ 1.02 |
| Đúng tiến độ | `#22D3EE` Cyan | 0.95 ≤ SPI < 1.02 |
| Chậm nhẹ | `#FBBF24` Amber | 0.85 ≤ SPI < 0.95 |
| Chậm nghiêm trọng | `#FB7185` Rose | SPI < 0.85 |
| Chưa khởi công | `#475569` Slate | — |

**Tính năng chế độ TV (không tương tác):**
- **Cinematic auto-tour**: camera tự bay dọc tuyến, dừng 8 giây tại mỗi gói thầu, hiện popup glass tóm tắt (tên gói, nhà thầu, % tiến độ, số HS chậm). Đây là điểm "wow" mạnh nhất khi tiếp đoàn.
- Tắt hoàn toàn zoom/pan bằng chuột ở kiosk mode.

**Overlay "Thông tin dự án"** (chính là widget 1.7 của bạn — gộp vào bản đồ để tiết kiệm không gian):

```
╭─────────────────────────────╮
│  DỰ ÁN CAO TỐC XYZ – GĐ 1   │
├─────────────────────────────┤
│  Chiều dài      78,5 km     │
│  Quy mô         4 làn xe    │
│  TMĐT           24.860 tỷ đ │
│  Nguồn vốn      NSNN + ODA  │
│  Khởi công      15/01/2024  │
│  Hoàn thành KH  31/12/2026  │
│  Chủ đầu tư     Ban QLDA... │
│  ▓▓▓▓▓▓▓▓░░░░  62.4%  D−865│
╰─────────────────────────────╯
```
Panel glass, đặt góc dưới-trái bản đồ, `backdrop-blur: 24px`, chiếm ~30% chiều rộng bản đồ.

---

#### **W1.2 — Tiến độ hồ sơ dự án (S-Curve)**

| Thuộc tính | Giá trị |
|---|---|
| Vị trí | `C7–C12, R2–R5` |
| Loại chart | **Combo: Line (3 series) + Bar (secondary axis)** |
| Thư viện | Apache ECharts |

**Cấu hình series:**

| Series | Kiểu | Style | Ý nghĩa |
|---|---|---|---|
| **Baseline** | Line | Nét đứt `[8,6]`, màu `#64748B`, width 3 | Kế hoạch gốc lũy kế |
| **Actual** | Line + Area gradient | Liền, `#22D3EE`, width 5, gradient cyan→transparent | Thực tế lũy kế |
| **Forecast** | Line | Chấm `[3,6]`, `#A78BFA`, width 3 | Dự báo tới hết dự án (hồi quy từ velocity 8 tuần gần nhất) |
| **Nộp trong kỳ** | Bar | `#22D3EE` alpha 25%, trục Y phải | Nhịp làm việc theo tuần/tháng |

**Thành phần bổ sung:**
- **Đường "Hôm nay"** (`markLine` dọc, màu trắng 50%, nhãn "Hôm nay").
- **Vùng chênh lệch** (`markArea`) giữa Baseline và Actual, tô đỏ nhạt nếu Actual < Baseline → nhìn phát biết ngay độ trễ.
- **Marker mốc** trên trục X tại các milestone chính.
- **Badge góc phải trên**: `Chậm 412 hồ sơ · ~ 5,2 tuần` — quy đổi độ trễ ra **số tuần**, vì lãnh đạo hiểu "tuần" chứ không hiểu "412 hồ sơ".

**Bộ lọc nhanh** (segmented control ở header widget): `Toàn dự án | Theo loại HS (Thiết kế/Thi công/Nghiệm thu) | Theo gói thầu`.

> 💡 **Khuyến nghị mạnh**: Thêm chỉ số **"Ngày dự báo hoàn thành"** ngay trên widget này (`Dự báo: 18/03/2027 · trễ 77 ngày`). Đây là con số duy nhất mà lãnh đạo thực sự muốn biết từ một S-curve.

---

#### **W1.3 — Top 5 gói thầu chậm hồ sơ**

| Thuộc tính | Giá trị |
|---|---|
| Vị trí | `C4–C6, R6–R8` |
| Loại chart | **Bullet chart ngang** (kết hợp bar + target marker) |

**Vì sao Bullet chart thay vì Bar thường?** Bullet chart hiển thị đồng thời *thực tế*, *mục tiêu* và *vùng ngưỡng* trong một dòng — mật độ thông tin cao nhất trên đơn vị diện tích, rất hợp màn hình TV.

**Cấu trúc mỗi dòng:**

```
XL-03 · Cầu vượt sông A                          ⚠ 38 ngày
Vinaconex — 2,4 km
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░│           64% / 92%
                               ▲ mục tiêu
```

| Thành phần | Nội dung |
|---|---|
| Dòng 1 | Mã gói · Tên rút gọn (tối đa 28 ký tự) + Badge số ngày chậm |
| Dòng 2 | Nhà thầu chính · Phạm vi (km hoặc hạng mục) — `caption`, opacity 60% |
| Dòng 3 | Bullet bar: fill = % HS đã nộp, vạch dọc = % mục tiêu tại thời điểm hiện tại |
| Bên phải | `64% / 92%` — tabular numbers |

**Sắp xếp**: theo `số ngày chậm bình quân có trọng số theo mức độ quan trọng của hồ sơ` (chứ không chỉ đếm số hồ sơ) — tránh trường hợp gói có nhiều hồ sơ vặt bị xếp trên gói tắc 1 hồ sơ trọng yếu.

---

#### **W1.4 + W1.5 — Bảng xếp hạng đơn vị (TVTK ⇄ Nhà thầu)**

> **Quyết định thiết kế quan trọng**: Gộp widget 1.4 (Top TVTK) và 1.5 (Top Nhà thầu) thành **một widget với segmented control**, tự động chuyển đổi mỗi 12 giây ở chế độ TV. Lý do: hai widget này có **cấu trúc dữ liệu giống hệt nhau**, tách ra làm tốn 2 ô lưới mà không thêm thông tin. Tiết kiệm được 1 ô cho widget Rủi ro rộng hơn.

| Thuộc tính | Giá trị |
|---|---|
| Vị trí | `C7–C9, R6–R8` |
| Loại | Ranked list + Progress ring + Trend arrow |

**Cấu trúc mỗi dòng (5 dòng):**

```
┌────────────────────────────────────────────────────┐
│  ①  ◕ 94%   TVTK Hạ tầng miền Nam        ▲ +3   │
│      ring    182/194 hồ sơ · FTAR 88%             │
├────────────────────────────────────────────────────┤
│  ②  ◔ 71%   Công ty TV Thiết kế ABC      ▼ −1   │
│              124/175 hồ sơ · FTAR 62%             │
└────────────────────────────────────────────────────┘
```

| Thành phần | Mô tả |
|---|---|
| Hạng | Số thứ tự trong huy hiệu tròn; top 3 có màu vàng/bạc/đồng nhạt |
| Progress ring | Vòng tròn tiến độ 56px, màu theo band, số % ở giữa |
| Tên đơn vị | `body-lg`, cắt bớt nếu quá dài, có tooltip |
| Dòng phụ | `nộp/yêu cầu` + `FTAR` — đây là điểm bổ sung so với yêu cầu gốc |
| Mũi tên xu hướng | Thay đổi thứ hạng so với tháng trước |

> 💡 **Bổ sung quan trọng**: Chỉ dùng tỷ lệ `nộp/phải nộp` sẽ khuyến khích hành vi "nộp cho có". Thêm **FTAR** vào dòng phụ, và tính điểm xếp hạng = `0.6 × tỷ_lệ_nộp + 0.4 × FTAR` để cân bằng số lượng và chất lượng.

---

#### **W1.6 — Top 5 rủi ro + Ma trận rủi ro**

| Thuộc tính | Giá trị |
|---|---|
| Vị trí | `C10–C12, R6–R8` |
| Loại | Split: Danh sách Top 5 (65%) + Mini risk matrix 5×5 (35%) |
| Nguồn | CDE Issues, đã chuẩn hóa Likelihood × Impact |

**Bố cục nội bộ:**

```
╭──────────────────────────────────────────────────────╮
│ ⚠️ TOP RỦI RO                          7 nghiêm trọng│
├───────────────────────────────────┬──────────────────┤
│ ● 20  Vướng GPMB Km32+400         │   Ảnh hưởng →    │
│       XL-04 · 47 ngày · Đ.T.Anh   │  5 │ ░░▓▓█      │
│ ● 16  Thiếu mỏ đất đắp K98        │  4 │ ░░▓▓▓      │
│       XL-02 · 23 ngày · N.V.Bình  │K 3 │ ░▓▓▓░      │
│ ● 15  Chậm duyệt BVTC hầm chui    │N 2 │ ▓▓░░░      │
│       XL-06 · 31 ngày · L.T.Hoa   │  1 │ ▓░░░░      │
│ ● 12  Mưa kéo dài ảnh hưởng nền   │    └───────────  │
│ ● 12  Chậm di dời đường điện 110kV│     1 2 3 4 5    │
╰───────────────────────────────────┴──────────────────╯
```

| Thành phần | Chi tiết |
|---|---|
| Chấm màu + RiskScore | Màu theo band, số điểm 1–25 |
| Tiêu đề rủi ro | Tối đa 34 ký tự |
| Dòng phụ | Gói thầu · Số ngày tồn · Người phụ trách (rất quan trọng — quy trách nhiệm) |
| Ma trận 5×5 | Heatmap mật độ, ô càng đậm càng nhiều issue; ô có Top 5 thì viền sáng |

**Chỉ số góc phải header**: `7 nghiêm trọng` + mini trend `mở mới 12 / đóng 8 (30 ngày)`.

---

#### **W1.7 — Album ảnh công trường**

| Thuộc tính | Giá trị |
|---|---|
| Vị trí | `C1–C3, R6–R8` |
| Loại | Mosaic carousel tự động |

**Thiết kế:**
- Bố cục **1 ảnh lớn (60%) + 4 thumbnail (40%)**, ảnh lớn tự chuyển mỗi 8 giây với hiệu ứng Ken Burns (zoom chậm) + cross-fade.
- Overlay gradient đen từ dưới lên, chứa: `Gói XL-03 · Km 24+500 · 18/08/2026 · Đổ bê tông trụ T4`.
- Badge góc trên phải: `🔴 LIVE` nếu ảnh < 2 giờ, hoặc `2 giờ trước`.
- Nếu có camera IP: chèn 1 slot **live stream** (HLS) xen kẽ.
- Ảnh drone panorama: dùng slot ảnh lớn, kéo dài 12 giây.

> ⚠️ **Kỹ thuật**: Ảnh phải được resize sẵn ở backend (thumbnail 400px, large 1200px, WebP/AVIF). Không tải ảnh gốc từ điện thoại (5–10MB) lên TV — sẽ giật và tốn băng thông.

---

#### **W1.8 — Dải mốc tiến độ / Lịch sự kiện**

| Thuộc tính | Giá trị |
|---|---|
| Vị trí | `C1–C12, R9` (full width) |
| Loại | **Horizontal milestone timeline** |

**Vì sao full-width, 1 hàng?** Timeline vốn là dữ liệu 1 chiều theo trục thời gian — đặt full-width tận dụng tối đa tỷ lệ 16:9 và chỉ tốn 1 hàng lưới.

```
◄─ Quá khứ ──────────────────────── HÔM NAY ──────────────────── Tương lai ─►

  ●━━━━━━━━━●━━━━━━━━━●━━━━━━━━━◐╌╌╌╌╌╌╌╌╌○╌╌╌╌╌╌╌╌╌○╌╌╌╌╌╌╌╌╌○
  Khởi công  Bàn giao   Hoàn thành  Hợp long  Thảm BTN  Thông xe  Hoàn thành
  15/01/24   MB 70%     nền đường   cầu chính  lớp 1    kỹ thuật   toàn bộ
  ✓ Đúng hạn ✓          ⚠ Trễ 22d   ▶ Đang    D−42     D−187     D−398
                                     làm 68%
```

| Ký hiệu | Ý nghĩa |
|---|---|
| `●` liền, emerald | Mốc đã hoàn thành đúng hạn |
| `●` liền, amber | Đã hoàn thành nhưng trễ (kèm số ngày trễ) |
| `◐` pulse, cyan | Mốc đang thực hiện (kèm %) |
| `○` rỗng, slate | Mốc tương lai (kèm D−n) |
| Đường nối liền/đứt | Đã qua / chưa tới |

**Bổ sung**: Chèn thêm **sự kiện phi tiến độ** (họp giao ban, đoàn kiểm tra, lễ khởi công hạng mục) bằng icon nhỏ phía trên đường timeline, màu violet — đáp ứng đúng yêu cầu "Lịch sự kiện" của bạn mà không tốn thêm widget.

### 6.4 Bảng tóm tắt Tab 1

| ID | Widget | Vị trí lưới | Loại chart | Refresh | Ưu tiên |
|---|---|---|---|---|---|
| W1.0 | Global KPI Strip | C1–12, R1 | KPI cards + sparkline | 5 phút | P0 |
| W1.1 | Bản đồ GIS | C1–6, R2–5 | MapLibre WebGL | 15 phút | P0 |
| W1.2 | S-Curve hồ sơ | C7–12, R2–5 | Line + Bar combo | 15 phút | P0 |
| W1.7 | Ảnh công trường | C1–3, R6–8 | Mosaic carousel | 5 phút | P1 |
| W1.3 | Top gói thầu chậm | C4–6, R6–8 | Bullet chart | 15 phút | P0 |
| W1.4/1.5 | Xếp hạng đơn vị | C7–9, R6–8 | Ranked list + ring | 15 phút | P0 |
| W1.6 | Top rủi ro | C10–12, R6–8 | List + Heatmap 5×5 | 15 phút | P0 |
| W1.8 | Dải mốc tiến độ | C1–12, R9 | Timeline | 1 giờ | P1 |

---

## 7. TAB 2 — SƠ ĐỒ TỔ CHỨC (ORG CHART)

### 7.1 Câu hỏi tab này trả lời

> *"Ai đang làm gì ở cụm nào? Liên hệ với ai khi có vấn đề? Đơn vị đó đang khỏe hay yếu?"*

### 7.2 Phân tích thách thức thiết kế

Org chart dạng cây cho dự án cao tốc có thể lên tới **hàng trăm node** (5 cụm × 6 vai trò × 3–5 đơn vị × N đầu mối). Hiển thị toàn bộ trên 1 màn hình TV là **không khả thi** và cũng **không hữu ích cho lãnh đạo**.

**Ba phương án đã cân nhắc:**

| Phương án | Ưu | Nhược | Kết luận |
|---|---|---|---|
| A. Cây dọc truyền thống (top-down) | Quen thuộc | Chiều rộng bùng nổ, không vừa 16:9 | ❌ |
| B. Cây ngang (left-right) có thu gọn | Vừa tỷ lệ 16:9, mở rộng theo chiều sâu tự nhiên | Vẫn cần cuộn khi nhiều node | ✅ **Chọn** |
| C. Sunburst / Radial tree | Đẹp, gọn | Khó đọc tên đơn vị, khó thêm chỉ số | ⚠️ Dùng làm view phụ |

**Giải pháp: Master–Detail 3 vùng** — Rail cụm dự án · Canvas cây ngang · Panel chi tiết.

### 7.3 Sơ đồ bố cục

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                             │
├────────────────────────────────────────────────────────────────────────────────────┤
│ R1  [Cụm dự án: 5] [Gói thầu: 18] [Đơn vị: 47] [Nhân sự chủ chốt: 213] [🔴 3 c.báo]│
├──────────────┬─────────────────────────────────────────────┬───────────────────────┤
│ R2  ╭───────╮│ ╭─────────────────────────────────────────╮ │ ╭───────────────────╮ │
│ R3  │CỤM    ││ │  CANVAS ORG TREE (ngang)  C4–C9, R2–R9  │ │ │ CHI TIẾT ĐƠN VỊ   │ │
│ R4  │DỰ ÁN  ││ │                                         │ │ │ C10–C12, R2–R9    │ │
│ R5  │C1–C3  ││ │  ┌─CỤM 1─┐                              │ │ │                   │ │
│ R6  │       ││ │  │Cao tốc│──┬── Chủ đầu tư ── Ban QLDA   │ │ │ [Logo] Vinaconex  │ │
│ R7  │◉ Cụm 1││ │  │Km0–25 │  ├── TV Giám sát ─┬─ TVGS A   │ │ │ Nhà thầu chính    │ │
│ R8  │○ Cụm 2││ │  └───────┘  │                └─ TVGS B   │ │ │ ───────────────   │ │
│ R9  │○ Cụm 3││ │             ├── TV Thiết kế ── TEDI      │ │ │ 🟢 Sức khỏe 87    │ │
│     │○ Cầu  ││ │             ├── Nhà thầu ────┬─ Vinacon. │ │ │ Gói: XL-01,XL-03  │ │
│     │○ Hầm  ││ │             │                └─ Cienco4  │ │ │ HĐ: 3.240 tỷ      │ │
│     │       ││ │             └── GPMB ────────── UBND H.X │ │ │ Tiến độ: 71%      │ │
│     │[Tìm..]││ │                                         │ │ │ ─── ĐẦU MỐI ───   │ │
│     ╰───────╯│ ╰─────────────────────────────────────────╯ │ │ 👤 Nguyễn V.A     │ │
│              │        [Cây] [Ma trận RACI] [Thẻ]           │ │    GĐ điều hành   │ │
│              │                                             │ │    📞 09xx · ✉    │ │
└──────────────┴─────────────────────────────────────────────┴───────────────────────┘
```

### 7.4 Đặc tả widget

#### **W2.1 — Rail cụm dự án** (`C1–C3, R2–R9`)

| Thành phần | Mô tả |
|---|---|
| Danh sách cụm | Mỗi cụm là 1 card glass: tên cụm, phạm vi Km, loại công trình (icon), số đơn vị, thanh tiến độ mini |
| Trạng thái chọn | Card active có viền cyan phát sáng + nền sáng hơn |
| Chỉ báo cảnh báo | Chấm đỏ nếu cụm có đơn vị điểm sức khỏe < 55 |
| Ô tìm kiếm | Chỉ hiển thị ở chế độ tương tác (ẩn ở kiosk) |
| Auto-cycle (kiosk) | Tự chuyển cụm mỗi 10 giây |

#### **W2.2 — Canvas Org Tree** (`C4–C9, R2–R9`)

| Thuộc tính | Giá trị |
|---|---|
| Thư viện | **React Flow** (khuyến nghị — hỗ trợ custom node React, dagre auto-layout) hoặc ECharts `tree` |
| Hướng | Left → Right |
| Layout engine | `dagre` với `rankdir: LR`, `nodesep: 24`, `ranksep: 80` |

**Cấu trúc 4 cấp:**

```
Cấp 1: CỤM DỰ ÁN   → Node lớn, glass đậm, icon loại công trình
Cấp 2: VAI TRÒ     → Node pill, màu phân biệt theo vai trò
Cấp 3: ĐƠN VỊ      → Node card có logo, tên, badge sức khỏe
Cấp 4: ĐẦU MỐI     → Node nhỏ, avatar + tên + chức danh (mặc định thu gọn)
```

**Mã màu theo vai trò (Cấp 2):**

| Vai trò | Màu |
|---|---|
| Chủ đầu tư / Ban QLDA | `#A78BFA` Violet |
| Tư vấn giám sát | `#22D3EE` Cyan |
| Tư vấn thiết kế | `#38BDF8` Sky |
| Tư vấn thẩm tra | `#818CF8` Indigo |
| Nhà thầu thi công | `#34D399` Emerald |
| GPMB / Địa phương | `#FBBF24` Amber |
| Đơn vị khác | `#94A3B8` Slate |

**Node đơn vị (Cấp 3) — thiết kế chi tiết:**

```
╭──────────────────────────────╮
│ [logo] VINACONEX        🟢87 │
│        Nhà thầu chính        │
│        2 gói · 3.240 tỷ      │
│        ▓▓▓▓▓▓▓░░░ 71%        │
╰──────────────────────────────╯
```

**Chế độ xem thay thế (view toggle):**

| View | Mô tả | Khi nào dùng |
|---|---|---|
| **Cây** (mặc định) | Như trên | Xem cấu trúc phân cấp |
| **Ma trận RACI** | Bảng Gói thầu × Đơn vị, ô đánh dấu R/A/C/I | Xem ai chịu trách nhiệm gói nào — **rất hữu ích khi họp** |
| **Thẻ** (Card grid) | Lưới card đơn vị, sắp theo điểm sức khỏe | Xem nhanh toàn bộ đơn vị |

> 💡 **Đề xuất giá trị cao**: View **Ma trận RACI** thường bị bỏ qua nhưng lại là thứ lãnh đạo hỏi nhiều nhất — *"Gói này ai chịu trách nhiệm chính?"*. Chi phí phát triển thấp (chỉ là bảng), giá trị nghiệp vụ cao.

#### **W2.3 — Panel chi tiết đơn vị** (`C10–C12, R2–R9`)

| Khối | Nội dung |
|---|---|
| **Nhận diện** | Logo, tên đầy đủ, tên viết tắt, vai trò, MST |
| **Sức khỏe** | Điểm tổng + mini radar 6 trụ cột |
| **Phạm vi** | Danh sách gói thầu tham gia, giá trị hợp đồng, % tiến độ |
| **Hồ sơ** | Đã nộp/yêu cầu · FTAR · TAT · số HS quá hạn |
| **Đầu mối liên hệ** | Tối đa 3 người: avatar, tên, chức danh, SĐT, email. Có **QR code vCard** để lãnh đạo quét bằng điện thoại lưu danh bạ |
| **Cảnh báo** | Các vấn đề đang mở liên quan đơn vị này |

> 💡 **QR vCard** là chi tiết nhỏ nhưng cực kỳ được đánh giá cao trong các buổi họp — lãnh đạo quét là có ngay số điện thoại người phụ trách.

**Chế độ kiosk**: Panel này tự động hiển thị đơn vị có điểm sức khỏe thấp nhất trong cụm đang chọn.

---

## 8. TAB 3 — TÀI CHÍNH

### 8.1 Câu hỏi tab này trả lời

> *"Tiền đã đi đâu, còn bao nhiêu, giải ngân có đạt kế hoạch không, và có nguy cơ vượt tổng mức đầu tư không?"*

### 8.2 Sơ đồ bố cục

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                             │
├────────────────────────────────────────────────────────────────────────────────────┤
│ R1 ┌────────┬────────┬────────┬────────┬────────┬────────┐                         │
│    │ TMĐT   │Đã ký HĐ│Cam kết │Nghiệm  │Giải    │  CPI   │                         │
│    │24.860tỷ│21.340tỷ│18.720tỷ│thu     │ngân    │  0.97  │                         │
│    │        │  85.8% │  75.3% │13.480tỷ│11.960tỷ│EAC 25.6│                         │
│    └────────┴────────┴────────┴────────┴────────┴────────┘                         │
├────────────────────────────────┬───────────────────────┬───────────────────────────┤
│ R2 ╭──────────────────────────╮│╭─────────────────────╮│╭─────────────────────────╮│
│ R3 │ 💧 WATERFALL DÒNG TIỀN   │││ 📈 S-CURVE GIẢI NGÂN│││ 🧩 CƠ CẤU CHI PHÍ       ││
│ R4 │ TMĐT → Giải ngân → Còn lại│││ KH năm vs Thực tế   │││ (Treemap)               ││
│ R5 │ C1–C4, R2–R5             │││ C5–C8, R2–R5        │││ C9–C12, R2–R5           ││
│    ╰──────────────────────────╯│╰─────────────────────╯│╰─────────────────────────╯│
├────────────────────────────────────────────┬───────────────┬───────────────────────┤
│ R6 ╭────────────────────────────────────╮  │╭────────────╮│╭─────────────────────╮ │
│ R7 │ 📋 BẢNG GÓI THẦU — GIÁ TRỊ & T.TOÁN│  ││⚡ PHÁT SINH││││💰 GIẢI NGÂN THEO   ││ │
│ R8 │ C1–C6, R6–R8                       │  ││& ĐIỀU CHỈNH││││NGUỒN VỐN / THÁNG   ││ │
│    │ Top 6 gói theo giá trị             │  ││C7–C9,R6–R8 ││││C10–C12, R6–R8      ││ │
│    ╰────────────────────────────────────╯  │╰────────────╯│╰─────────────────────╯ │
├────────────────────────────────────────────────────────────────────────────────────┤
│ R9 ╭────────────────────────────────────────────────────────────────────────────╮  │
│    │ 📊 GIẢI NGÂN THEO THÁNG (Bar KH vs TT + Line lũy kế %)  C1–C12, R9         │  │
│    ╰────────────────────────────────────────────────────────────────────────────╯  │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Đặc tả widget

#### **W3.1 — Waterfall dòng tiền** (`C1–C4, R2–R5`)

Biểu đồ thác nước là **cách trực quan nhất** để trả lời "tiền đi đâu" — vượt trội so với bảng số.

```
 24.860 ┃█████████████                                       TMĐT
        ┃            ▼ −3.520                                Chưa đấu thầu
 21.340 ┃            █████████████                           Giá trị HĐ đã ký
        ┃                        ▼ −2.620                    Chưa triển khai
 18.720 ┃                        ██████████                  Cam kết
        ┃                                  ▼ −5.240          Chưa nghiệm thu
 13.480 ┃                                  ███████           Đã nghiệm thu
        ┃                                        ▼ −1.520    Chờ thanh toán
 11.960 ┃                                        ██████      Đã giải ngân
        ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

| Cột | Màu | Ghi chú |
|---|---|---|
| Cột tổng (TMĐT, Giải ngân) | Cyan đậm | Cột "neo" |
| Cột giảm | Rose 60% | Kèm nhãn giá trị + % |
| Nhãn | Trên đầu cột, `body-lg`, tabular-nums | Đơn vị: **tỷ đồng** |

> ⚠️ **Chuẩn hóa đơn vị**: Thống nhất dùng **tỷ đồng, 3 chữ số thập phân tối đa** trên toàn bộ dashboard. Không trộn lẫn triệu/tỷ/nghìn tỷ.

#### **W3.2 — S-Curve giải ngân** (`C5–C8, R2–R5`)

| Series | Style | Ý nghĩa |
|---|---|---|
| Kế hoạch vốn năm (lũy kế) | Nét đứt, slate | Chỉ tiêu được giao |
| Thực tế giải ngân (lũy kế) | Liền, emerald + area gradient | Thực hiện |
| Dự báo cuối năm | Chấm, violet | Ngoại suy từ burn rate 3 tháng |
| Đường "Hôm nay" | Dọc, trắng 50% | Mốc so sánh |

**Badge nổi bật**: `Dự báo đạt 87% KH năm · thiếu 1.240 tỷ` — đây là con số quyết định của lãnh đạo tài chính.

**Chú thích ngưỡng**: vẽ `markLine` ngang tại mốc **95% KH năm** (ngưỡng thường dùng để đánh giá hoàn thành nhiệm vụ giải ngân đầu tư công).

#### **W3.3 — Cơ cấu chi phí** (`C9–C12, R2–R5`)

| Thuộc tính | Giá trị |
|---|---|
| Loại chart | **Treemap** (khuyến nghị) — thay vì Pie/Donut |
| Lý do | Pie với > 5 lát rất khó đọc trên TV. Treemap thể hiện tỷ trọng bằng diện tích, đọc được nhãn ngay trong ô, và hỗ trợ 2 cấp (khoản mục → gói thầu) |

**Các khoản mục cấp 1:**

| Khoản mục | Màu | Tỷ trọng điển hình |
|---|---|---|
| Chi phí xây lắp | Cyan | 60 – 70% |
| Chi phí GPMB | Amber | 10 – 20% |
| Chi phí thiết bị | Sky | 3 – 8% |
| Chi phí tư vấn | Violet | 3 – 6% |
| Chi phí QLDA | Indigo | 1 – 2% |
| Chi phí khác | Slate | 1 – 3% |
| Dự phòng | Rose (viền đứt) | 5 – 10% |

**Trong mỗi ô hiển thị**: Tên khoản mục · Giá trị (tỷ) · % tổng · thanh mini `đã giải ngân / kế hoạch`.

> 💡 **Điểm nhấn**: Ô **Dự phòng** vẽ viền nét đứt và hiện tỷ lệ đã sử dụng (`Đã dùng 42%`). Đây là chỉ báo sớm nhất của nguy cơ vượt TMĐT — lãnh đạo cần nhìn thấy nó nổi bật.

#### **W3.4 — Bảng gói thầu: Giá trị & Thanh toán** (`C1–C6, R6–R8`)

Chỉ hiển thị **Top 6 gói theo giá trị hợp đồng** (không phải toàn bộ).

| Cột | Kiểu | Ghi chú |
|---|---|---|
| Mã gói | Text mono | `XL-01` |
| Tên gói | Text | Cắt 30 ký tự |
| Nhà thầu | Text, opacity 70% | Viết tắt |
| Giá trị HĐ | Số, right-align, tabular | tỷ đ |
| Đã nghiệm thu | **Stacked mini-bar** | % trên tổng HĐ |
| Đã thanh toán | **Stacked mini-bar** | % trên tổng HĐ |
| Tạm ứng còn lại | Số + badge màu | Đỏ nếu > 15% giá trị HĐ |
| Trạng thái | Chip | `Đúng hạn / Chậm / Vướng` |

**Thiết kế cột thanh toán** — dùng 1 thanh xếp chồng thay vì 2 cột số:

```
▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒░░░░░░░░  Đã TT 52% · Đã NT 68% · Còn 32%
└─ đã thanh toán ─┘└NT chờ TT┘└─ chưa thực hiện ─┘
```

#### **W3.5 — Phát sinh & Điều chỉnh (VO)** (`C7–C9, R6–R8`)

| Thành phần | Mô tả |
|---|---|
| KPI lớn | `+842 tỷ` · `3.9% giá trị HĐ` + màu ngưỡng (xanh <5%, vàng 5–10%, đỏ >10%) |
| Donut nhỏ | Phân loại nguyên nhân: Thay đổi thiết kế / Điều kiện địa chất / Điều chỉnh giá VLXD / GPMB / Khác |
| Danh sách | Top 3 VO lớn nhất: tên, giá trị, trạng thái (Đề xuất/Đang thẩm định/Đã duyệt) |
| Chỉ báo | Số VO đang chờ duyệt + tổng giá trị chờ (rủi ro tiềm ẩn) |

#### **W3.6 — Giải ngân theo nguồn vốn** (`C10–C12, R6–R8`)

Stacked horizontal bar theo nguồn vốn (NSNN TW, NSNN ĐP, ODA, Vốn khác), mỗi thanh chia `Đã giải ngân | Còn lại`, kèm % và giá trị.

#### **W3.7 — Giải ngân theo tháng** (`C1–C12, R9`)

Combo chart full-width: Bar nhóm (KH tháng vs TT tháng) + Line lũy kế % KH năm. 12 tháng của năm hiện tại. Tháng chưa tới hiển thị bar KH mờ.

---

## 9. TAB 4 — SỨC KHỎE NHÀ THẦU / TƯ VẤN

### 9.1 Câu hỏi tab này trả lời

> *"Đơn vị nào đang có vấn đề, vấn đề ở khía cạnh nào, và cần can thiệp gì?"*

### 9.2 Sơ đồ bố cục

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                             │
├────────────────────────────────────────────────────────────────────────────────────┤
│ R1 ┌────────┬────────┬────────┬────────┬────────┬────────┐                         │
│    │Điểm TB │🟢 Tốt  │🟡 Theo │🔴 Rủi  │Cải     │Suy giảm│                         │
│    │  72.4  │  14 ĐV │dõi 9ĐV │ro 4 ĐV │thiện↑  │mạnh ↓  │                         │
│    │ ▲ +2.1 │        │        │        │Cienco4 │TVTK ABC│                         │
│    └────────┴────────┴────────┴────────┴────────┴────────┘                         │
├──────────────────────────┬─────────────────────────┬───────────────────────────────┤
│ R2 ╭────────────────────╮│╭───────────────────────╮│╭─────────────────────────────╮│
│ R3 │ 🎯 RADAR SO SÁNH   │││ 🫧 MA TRẬN KHỐI LƯỢNG │││ 🔥 HEATMAP TIÊU CHÍ × ĐƠN VỊ││
│ R4 │ 6 trụ cột · 3 ĐV   │││    × SỨC KHỎE         │││                             ││
│ R5 │ C1–C4, R2–R5       │││ C5–C8, R2–R5          │││ C9–C12, R2–R5               ││
│    ╰────────────────────╯│╰───────────────────────╯│╰─────────────────────────────╯│
├──────────────────────────────────────────────────────┬─────────────────────────────┤
│ R6 ╭────────────────────────────────────────────────╮│╭───────────────────────────╮│
│ R7 │ 🏅 BẢNG SCORECARD XẾP HẠNG                     │││ 🚨 CẢNH BÁO SỚM &         ││
│ R8 │ C1–C8, R6–R8                                   │││    KHUYẾN NGHỊ            ││
│    │ Hạng·Đơn vị·Vai trò·6 trụ cột·Tổng·Xu hướng    │││ C9–C12, R6–R8             ││
│    ╰────────────────────────────────────────────────╯│╰───────────────────────────╯│
├────────────────────────────────────────────────────────────────────────────────────┤
│ R9 ╭────────────────────────────────────────────────────────────────────────────╮  │
│    │ 📉 XU HƯỚNG ĐIỂM SỨC KHỎE BÌNH QUÂN 12 THÁNG   C1–C12, R9                  │  │
│    ╰────────────────────────────────────────────────────────────────────────────╯  │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Đặc tả widget

#### **W4.1 — Radar so sánh đa tiêu chí** (`C1–C4, R2–R5`)

| Thuộc tính | Giá trị |
|---|---|
| Loại | Radar chart 6 trục |
| Số series | Tối đa 3 (nhiều hơn sẽ rối) |
| Mặc định (kiosk) | Đơn vị tốt nhất (emerald) · Trung bình dự án (slate, nét đứt) · Đơn vị kém nhất (rose) |

**6 trục**: Tiến độ · Hồ sơ · Chất lượng · An toàn · Nguồn lực · Tài chính.

**Chi tiết hiển thị**: Vòng tròn nền chia 5 vòng (20/40/60/80/100), vùng 0–55 tô nền rose 8% để nhìn ra "vùng nguy hiểm" ngay.

> 💡 So sánh với "Trung bình dự án" là chi tiết quan trọng — nó cho lãnh đạo biết đơn vị kém *tuyệt đối* hay chỉ kém *tương đối*.

#### **W4.2 — Ma trận Khối lượng × Sức khỏe** (`C5–C8, R2–R5`)

| Thuộc tính | Giá trị |
|---|---|
| Loại | **Scatter / Bubble chart 4 góc phần tư** |
| Trục X | Điểm sức khỏe (0–100) |
| Trục Y | Khối lượng công việc đảm nhận (giá trị HĐ, tỷ đ) |
| Kích thước bubble | Số gói thầu tham gia |
| Màu bubble | Theo vai trò (nhà thầu / tư vấn) |

**Ý nghĩa 4 góc phần tư — đây là widget có giá trị ra quyết định cao nhất của Tab 4:**

```
   Khối lượng
      cao  │  🔴 VÙNG NGUY HIỂM      │  🟢 TRỤ CỘT
           │  Làm nhiều, làm kém     │  Làm nhiều, làm tốt
           │  → CAN THIỆP NGAY       │  → Duy trì, ưu tiên gói mới
           ├─────────────────────────┼─────────────────────────
           │  🟡 THEO DÕI            │  🔵 TIỀM NĂNG
      thấp │  Làm ít, làm kém        │  Làm ít, làm tốt
           │  → Cân nhắc thay thế    │  → Có thể giao thêm việc
           └─────────────────────────┴─────────────────────────
             kém          Điểm sức khỏe          tốt
```

Đường chia góc phần tư: X = 70 điểm, Y = trung vị khối lượng. Nhãn góc phần tư in mờ ở nền.

#### **W4.3 — Heatmap Tiêu chí × Đơn vị** (`C9–C12, R2–R5`)

| Thuộc tính | Giá trị |
|---|---|
| Loại | Heatmap ma trận |
| Hàng | Top 10 đơn vị (theo khối lượng) |
| Cột | 6 trụ cột |
| Thang màu | Rose (0) → Amber (55) → Cyan (75) → Emerald (100) |

Ô hiển thị số điểm nếu ≥ 24px. Ô < 40 điểm có viền đỏ nhấp nháy chậm.

**Giá trị**: Nhìn cột nào đỏ nhiều → **vấn đề hệ thống** của cả dự án (ví dụ cả cột "An toàn" đỏ → cần chấn chỉnh toàn tuyến, không phải lỗi riêng đơn vị nào).

#### **W4.4 — Bảng Scorecard xếp hạng** (`C1–C8, R6–R8`)

Hiển thị **Top 7 dòng** (kết hợp: 4 đơn vị điểm thấp nhất + 3 đơn vị điểm cao nhất, tách bằng đường phân cách).

| Cột | Kiểu hiển thị | Độ rộng |
|---|---|---|
| Hạng | Badge tròn | 5% |
| Đơn vị | Logo + tên | 22% |
| Vai trò | Chip màu | 12% |
| Tiến độ | Mini bar + số | 9% |
| Hồ sơ | Mini bar + số | 9% |
| Chất lượng | Mini bar + số | 9% |
| An toàn | Mini bar + số | 9% |
| Nguồn lực | Mini bar + số | 9% |
| Tài chính | Mini bar + số | 8% |
| **Tổng điểm** | Số lớn + màu band | 8% |

**Cột xu hướng**: sparkline 6 tháng + mũi tên thay đổi hạng.

> ⚠️ **Lưu ý chính trị**: Cân nhắc kỹ việc hiển thị công khai tên đơn vị xếp cuối trên TV phòng khách. Đề xuất có **chế độ "Ẩn danh"** (hiển thị "Nhà thầu A/B/C") bật được khi có khách, và chế độ đầy đủ khi họp nội bộ.

#### **W4.5 — Cảnh báo sớm & Khuyến nghị** (`C9–C12, R6–R8`)

Danh sách tối đa 4 cảnh báo, sinh tự động theo luật (rule engine):

```
╭────────────────────────────────────────────╮
│ 🔴  Cienco 4 — Điểm giảm 18 trong 2 tháng  │
│     Nguyên nhân: 3 NCR mới · TAT tăng 2,1× │
│     ➜ Đề xuất: Họp chấn chỉnh trước 25/08  │
├────────────────────────────────────────────┤
│ 🟠  TVTK ABC — FTAR chỉ 54% (ngưỡng 75%)   │
│     ➜ Đề xuất: Rà soát quy trình nội bộ    │
╰────────────────────────────────────────────╯
```

**Bộ luật cảnh báo đề xuất:**

| Điều kiện | Mức | Khuyến nghị tự động |
|---|---|---|
| Điểm giảm > 15 trong 60 ngày | 🔴 | Họp chấn chỉnh |
| Điểm < 55 liên tiếp 2 kỳ | 🔴 | Cảnh báo văn bản / xem xét chế tài |
| FTAR < 60% | 🟠 | Rà soát quy trình lập hồ sơ |
| Nguồn lực huy động < 70% cam kết | 🟠 | Yêu cầu bổ sung nhân lực/thiết bị |
| Có NCR mở > 30 ngày | 🟠 | Yêu cầu kế hoạch khắc phục |
| Có sự cố ATLĐ trong 30 ngày | 🔴 | Kiểm tra hiện trường đột xuất |

#### **W4.6 — Xu hướng điểm sức khỏe 12 tháng** (`C1–C12, R9`)

Line chart full-width: điểm trung bình toàn dự án (đậm) + band min-max (vùng mờ) + 2 đường của đơn vị tốt nhất/kém nhất.

---

## 10. HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM) — DARK + GLASSMORPHISM

### 10.1 Triết lý thị giác

> **"Kính trên vũ trụ"** — Nền tối sâu như bầu trời đêm, thông tin nổi lên trên các tấm kính mờ phát sáng nhẹ, dữ liệu là ánh sáng.

Ba nguyên tắc:
1. **Nền không bao giờ đen tuyệt đối** (`#000`) — dùng xanh đen sâu để tránh cảm giác "lỗ đen" và giảm mỏi mắt.
2. **Glass phải có "nguồn sáng"** — nếu nền phẳng, hiệu ứng kính sẽ vô nghĩa. Bắt buộc có 2–3 quầng sáng (aurora blob) mờ chuyển động rất chậm phía sau.
3. **Màu là ngữ nghĩa, không phải trang trí** — mỗi màu gắn với một trạng thái cố định, không dùng màu tùy hứng.

### 10.2 Bảng màu (Design Tokens)

#### Nền & bề mặt

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--bg-base` | `#070B14` | Nền ngoài cùng |
| `--bg-gradient` | `radial-gradient(ellipse at 20% 0%, #0F1B33 0%, #070B14 55%)` | Nền chính |
| `--aurora-1` | `#1E40AF` blur 180px, opacity 0.28 | Quầng sáng góc trên trái |
| `--aurora-2` | `#0E7490` blur 200px, opacity 0.22 | Quầng sáng góc dưới phải |
| `--aurora-3` | `#5B21B6` blur 220px, opacity 0.15 | Quầng sáng giữa phải |
| `--glass-bg` | `rgba(255,255,255,0.045)` | Nền tấm kính |
| `--glass-bg-hover` | `rgba(255,255,255,0.075)` | Kính khi hover/active |
| `--glass-border` | `rgba(255,255,255,0.10)` | Viền kính |
| `--glass-highlight` | `rgba(255,255,255,0.16)` | Viền sáng cạnh trên (1px) |

#### Chữ

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--text-primary` | `#F1F5F9` | Số liệu, tiêu đề |
| `--text-secondary` | `#94A3B8` | Nhãn, mô tả |
| `--text-tertiary` | `#64748B` | Đơn vị, chú thích |

#### Màu ngữ nghĩa (Semantic)

| Token | Hex | Ý nghĩa | Glow |
|---|---|---|---|
| `--accent` | `#22D3EE` | Màu chủ đạo, dữ liệu chính | `0 0 24px rgba(34,211,238,.35)` |
| `--success` | `#34D399` | Tốt / Đúng hạn / Vượt KH | `0 0 24px rgba(52,211,153,.30)` |
| `--warning` | `#FBBF24` | Cần chú ý / Chậm nhẹ | `0 0 24px rgba(251,191,36,.30)` |
| `--danger` | `#FB7185` | Nghiêm trọng / Trễ hạn | `0 0 24px rgba(251,113,133,.35)` |
| `--info` | `#A78BFA` | Dự báo / Thông tin phụ | — |
| `--neutral` | `#64748B` | Baseline / Chưa bắt đầu | — |

> ⚠️ **Không dùng đỏ thuần `#FF0000` và xanh lá thuần `#00FF00`** trên nền tối — chúng gây quầng sáng (chromatic aberration) và mỏi mắt sau vài phút. Luôn dùng phiên bản pastel-hóa như trên.

#### Bảng màu chuỗi dữ liệu (Categorical palette)

Thứ tự sử dụng cho biểu đồ nhiều series:

```
1. #22D3EE  Cyan      4. #FBBF24  Amber     7. #2DD4BF  Teal
2. #A78BFA  Violet    5. #FB7185  Rose      8. #FCD34D  Yellow
3. #34D399  Emerald   6. #60A5FA  Blue      9. #94A3B8  Slate (nhóm "Khác")
```

### 10.3 Đặc tả hiệu ứng Glassmorphism

**Ba cấp độ kính:**

| Cấp | Dùng cho | blur | bg | border | shadow |
|---|---|---|---|---|---|
| **L1 — Panel nền** | Container widget | 20px | `rgba(255,255,255,.045)` | `1px rgba(255,255,255,.10)` | `0 8px 32px rgba(0,0,0,.36)` |
| **L2 — Card nổi** | KPI card, node org | 28px | `rgba(255,255,255,.07)` | `1px rgba(255,255,255,.14)` | `0 12px 40px rgba(0,0,0,.44)` |
| **L3 — Overlay** | Modal, tooltip, popup bản đồ | 40px | `rgba(15,23,42,.72)` | `1px rgba(255,255,255,.18)` | `0 24px 64px rgba(0,0,0,.60)` |

**CSS chuẩn cho panel L1:**

```css
.glass-panel {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.025) 100%
  );
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.16); /* đường sáng cạnh trên — tạo cảm giác "kính thật" */
  position: relative;
  overflow: hidden;
}

/* Vệt sáng chéo tinh tế phía trên bên trái */
.glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    120% 80% at 0% 0%,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 55%
  );
  pointer-events: none;
}
```

> ⚠️ **Cảnh báo hiệu năng nghiêm trọng**: `backdrop-filter` là thuộc tính **rất nặng** với GPU. Trên TV box hoặc mini PC cấu hình thấp, 9 panel cùng blur sẽ tụt xuống 15–20 FPS.
>
> **Giải pháp bắt buộc:**
> - Chỉ áp `backdrop-filter` cho **container widget cấp 1** (tối đa 9–10 phần tử/màn hình). Các phần tử con dùng nền màu phẳng bán trong suốt (không blur).
> - Cung cấp **chế độ `--perf-mode`**: thay `backdrop-filter` bằng `background: rgba(15,23,42,.78)` tĩnh. Tự động bật khi FPS < 30 (đo bằng `requestAnimationFrame`).
> - Không animate phần tử có `backdrop-filter` (chỉ animate `opacity`/`transform` của phần tử khác).

### 10.4 Bo góc, khoảng cách, hiệu ứng

| Token | Giá trị |
|---|---|
| `radius-sm` / `md` / `lg` / `xl` | 8 / 12 / 20 / 28 px |
| `space` scale | 4, 8, 12, 16, 24, 32, 48 px |
| Widget padding | 24 px |
| Gutter lưới | 14 px |
| Duration | fast 150ms · base 250ms · slow 400ms · ambient 20s |
| Easing | `cubic-bezier(0.4, 0, 0.2, 1)` |

### 10.5 Font chữ

| Vai trò | Font | Lý do |
|---|---|---|
| Chính | **Be Vietnam Pro** | Thiết kế riêng cho tiếng Việt, dấu thanh cân đối, đủ 9 weight |
| Thay thế | Inter (có `latin-ext`) | Nếu cần font quốc tế hơn |
| Số liệu | **JetBrains Mono** hoặc `font-variant-numeric: tabular-nums` | Số thẳng cột, không nhảy khi cập nhật realtime |

> ⚠️ Bắt buộc dùng `font-variant-numeric: tabular-nums` cho **mọi** con số cập nhật động — nếu không, số sẽ "nhảy giật" mỗi lần refresh, rất khó chịu khi nhìn trên TV.

### 10.6 Cấu hình Tailwind

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: { DEFAULT: '#070B14', elevated: '#0F1729' },
        glass: {
          bg: 'rgba(255,255,255,0.045)',
          'bg-hover': 'rgba(255,255,255,0.075)',
          border: 'rgba(255,255,255,0.10)',
        },
        accent: { DEFAULT: '#22D3EE', dim: '#0E7490' },
        success: { DEFAULT: '#34D399', dim: '#065F46' },
        warning: { DEFAULT: '#FBBF24', dim: '#78350F' },
        danger: { DEFAULT: '#FB7185', dim: '#881337' },
        info: { DEFAULT: '#A78BFA', dim: '#4C1D95' },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Thang chữ tối ưu cho TV @1920x1080
        caption: ['18px', { lineHeight: '24px', fontWeight: '500' }],
        'body-md': ['20px', { lineHeight: '28px' }],
        'body-lg': ['24px', { lineHeight: '32px', fontWeight: '500' }],
        'heading-md': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'display-lg': ['64px', { lineHeight: '68px', fontWeight: '700' }],
        'display-xl': ['88px', { lineHeight: '92px', fontWeight: '700' }],
      },
      backdropBlur: { glass: '20px', 'glass-lg': '28px', 'glass-xl': '40px' },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,.36), inset 0 1px 0 rgba(255,255,255,.16)',
        'glow-accent': '0 0 24px rgba(34,211,238,.35)',
        'glow-danger': '0 0 24px rgba(251,113,133,.35)',
      },
      gridTemplateColumns: { dashboard: 'repeat(12, minmax(0, 1fr))' },
      gridTemplateRows: { dashboard: 'repeat(9, minmax(0, 1fr))' },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(.4,0,.6,1) infinite',
        aurora: 'aurora 24s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
```

### 10.7 Chuẩn hóa hiển thị số liệu

| Loại | Định dạng | Ví dụ |
|---|---|---|
| Tiền (lớn) | `#.###,# tỷ` — dấu chấm phân cách nghìn (chuẩn VN) | `24.860,5 tỷ` |
| Tiền (nhỏ) | `#.### triệu` | `842 triệu` |
| Phần trăm | 1 chữ số thập phân | `62,4%` |
| Delta | Luôn có dấu + mũi tên | `▲ +3,1%` / `▼ −2,8%` |
| Ngày | `DD/MM/YYYY` | `18/08/2026` |
| Đếm ngược | `D−n` | `D−42` |
| Số lượng | Phân cách nghìn | `1.842 hồ sơ` |

**Quy tắc màu delta**: xanh nếu **thay đổi theo hướng tốt** (không phải "tăng"). Ví dụ: số rủi ro giảm → mũi tên xuống nhưng **màu xanh**. Đây là lỗi thường gặp cần tránh.

### 10.8 Anatomy của một Widget chuẩn

```
╭─────────────────────────────────────────────────────────╮ ← glass L1, radius 20
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📈  TIẾN ĐỘ HỒ SƠ DỰ ÁN            [▾ Bộ lọc]   │   │ ← Header 56px
│  │     Cập nhật 14:32                  ⚠ Chậm 5,2t │   │   heading-md + caption
│  └──────────────────────────────────────────────────┘   │
│  ─────────────────────────────────────────────────────  │ ← divider 1px, white 8%
│                                                         │
│                    VÙNG NỘI DUNG                        │ ← padding 24
│                                                         │
│  ─────────────────────────────────────────────────────  │
│   ┄┄ Baseline    ── Thực tế    ⋯⋯ Dự báo               │ ← Footer/legend 40px
╰─────────────────────────────────────────────────────────╯
```

**Trạng thái widget bắt buộc thiết kế:**

| Trạng thái | Xử lý |
|---|---|
| Loading | Skeleton shimmer trên nền glass (KHÔNG dùng spinner giữa màn hình) |
| Empty | Icon mờ + "Chưa có dữ liệu" + hướng dẫn ngắn |
| Error | Icon cảnh báo + "Không tải được dữ liệu" + nút thử lại + **hiện dữ liệu cache cũ kèm nhãn "Dữ liệu lúc HH:mm"** |
| Stale (dữ liệu cũ > 2× chu kỳ) | Widget giảm opacity 70% + badge cam "Dữ liệu cũ" |

> 💡 **Rất quan trọng cho TV 24/7**: Không bao giờ để widget trống khi mất kết nối. Luôn hiển thị dữ liệu cache gần nhất kèm nhãn thời gian. Màn hình trống trong phòng họp là tình huống tệ nhất.

---

## 11. KIẾN TRÚC KỸ THUẬT & TECH STACK

### 11.1 Tổng quan kiến trúc

```
┌───────────────────────────────────────────────────────────────────────┐
│  TẦNG HIỂN THỊ                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │  TV Kiosk    │  │   Tablet     │  │   Desktop    │                 │
│  │ (Chrome full)│  │  (PWA)       │  │  (Browser)   │                 │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                 │
└─────────┼─────────────────┼─────────────────┼─────────────────────────┘
          └─────────────────┼─────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────────────────┐
│  FRONTEND — React 18 + TypeScript + Vite                              │
│  · TailwindCSS  · Redux Toolkit (UI state)  · SWR (server state)      │
│  · ECharts (charts)  · MapLibre GL (GIS)  · React Flow (org tree)     │
│  · i18next  · Framer Motion  · react-hook-form (admin)                │
└───────────────────────────────┬───────────────────────────────────────┘
                                │ HTTPS / REST + SSE
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│  BFF / API GATEWAY — Node.js 20 + NestJS + TypeScript                 │
│  · Aggregation & shaping (1 request = 1 tab)                          │
│  · Auth (JWT / OIDC)  · Rate limit  · SSE push                        │
│  · Redis cache (TTL theo widget)                                      │
└───────────────────────────────┬───────────────────────────────────────┘
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│  TẦNG DỮ LIỆU & TÍCH HỢP                                              │
│  ┌─────────────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │ PostgreSQL 16   │  │  Redis 7     │  │  MinIO / S3             │   │
│  │ + PostGIS       │  │  cache+queue │  │  ảnh, tài liệu          │   │
│  │ + TimescaleDB*  │  └──────────────┘  └─────────────────────────┘   │
│  └─────────────────┘                                                  │
│  ETL Workers (BullMQ) ──► CDE API · ERP · P6 · GIS · HRM · Excel      │
└───────────────────────────────────────────────────────────────────────┘
        (*) TimescaleDB cho chuỗi thời gian KPI — tùy chọn
```

### 11.2 Danh mục thư viện Frontend

| Nhu cầu | Lựa chọn | Lý do chọn |
|---|---|---|
| Framework | **React 18 + TypeScript 5** | Theo yêu cầu; concurrent rendering tốt cho dashboard nhiều widget |
| Build | **Vite 5** | HMR nhanh, build nhỏ, hỗ trợ TS native |
| Styling | **TailwindCSS 3** | Theo yêu cầu; tokens tập trung, không CSS-in-JS runtime overhead |
| Server state | **SWR 2** | Theo yêu cầu; `refreshInterval`, `keepPreviousData`, `focusThrottle` rất hợp dashboard tự làm mới |
| Global state | **Redux Toolkit** | Theo yêu cầu; quản lý tab hiện tại, bộ lọc, kiosk config, perf-mode |
| Biểu đồ | **Apache ECharts 5** (`echarts-for-react`) | **Vượt trội Recharts** cho ca này: hỗ trợ canvas rendering (hiệu năng cao trên TV), có sẵn treemap/radar/heatmap/sunburst/graph, theme dark tùy biến sâu, animation mượt, `dataZoom`, xử lý được 10k+ điểm |
| Bản đồ | **MapLibre GL JS 4** | Mã nguồn mở, WebGL, hỗ trợ vector tile + 3D terrain, dark style sẵn có. Nếu hệ thống GIS hiện hữu là ArcGIS → dùng `@arcgis/core` hoặc Leaflet + WMS |
| Org tree | **React Flow 12** + `dagre` | Node là component React → nhúng được badge sức khỏe, logo, progress bar |
| Animation | **Framer Motion 11** | Chuyển tab, số đếm, xuất hiện widget |
| Form (admin) | **react-hook-form + zod** | Theo yêu cầu |
| i18n | **i18next + react-i18next** | Theo yêu cầu; mặc định `vi`, chuẩn bị sẵn `en` cho nhà tài trợ ODA |
| Ngày tháng | **date-fns** + locale `vi` | Nhẹ hơn moment, tree-shakeable |
| Số đếm động | **@number-flow/react** hoặc tự viết hook | Hiệu ứng số chạy khi cập nhật |
| Icon | **Lucide React** | Nét mảnh, hợp dark theme, tree-shakeable |
| Bảng | **TanStack Table 8** (headless) | Chỉ dùng cho bảng có sort/filter (Tab 3, 4) |

> **Ghi chú về ECharts vs Recharts**: Recharts dựa trên SVG — với 9 widget cùng render trên TV 4K sẽ tạo hàng nghìn DOM node, gây giật. ECharts render canvas, giữ được 60fps. Đây là khác biệt quyết định cho kiosk 24/7.

### 11.3 Cấu trúc thư mục (Feature-based)

```
src/
├── app/
│   ├── store.ts                    # Cấu hình Redux store
│   ├── hooks.ts                    # useAppDispatch, useAppSelector
│   ├── router.tsx                  # Định tuyến tab
│   └── providers/
│       ├── SwrProvider.tsx
│       ├── I18nProvider.tsx
│       └── ThemeProvider.tsx
│
├── features/
│   ├── overview/                   # TAB 1
│   │   ├── components/
│   │   │   ├── ProjectMapWidget.tsx
│   │   │   ├── DocumentSCurveWidget.tsx
│   │   │   ├── DelayedPackagesWidget.tsx
│   │   │   ├── UnitRankingWidget.tsx
│   │   │   ├── TopRisksWidget.tsx
│   │   │   ├── SitePhotosWidget.tsx
│   │   │   ├── ProjectInfoOverlay.tsx
│   │   │   └── MilestoneRibbonWidget.tsx
│   │   ├── hooks/
│   │   │   ├── useOverviewData.ts
│   │   │   ├── useDocumentProgress.ts
│   │   │   └── useSitePhotos.ts
│   │   ├── services/
│   │   │   └── OverviewService.ts
│   │   ├── types/
│   │   │   └── overview.types.ts
│   │   ├── utils/
│   │   │   └── calculateForecast.ts
│   │   └── OverviewPage.tsx
│   │
│   ├── orgChart/                   # TAB 2
│   │   ├── components/
│   │   │   ├── ClusterRail.tsx
│   │   │   ├── OrgTreeCanvas.tsx
│   │   │   ├── OrgNodeUnit.tsx
│   │   │   ├── RaciMatrixView.tsx
│   │   │   └── UnitDetailPanel.tsx
│   │   ├── hooks/useOrgTree.ts
│   │   ├── services/OrgChartService.ts
│   │   ├── types/orgChart.types.ts
│   │   └── OrgChartPage.tsx
│   │
│   ├── finance/                    # TAB 3
│   │   ├── components/
│   │   │   ├── CashflowWaterfallWidget.tsx
│   │   │   ├── DisbursementSCurveWidget.tsx
│   │   │   ├── CostBreakdownTreemapWidget.tsx
│   │   │   ├── PackagePaymentTableWidget.tsx
│   │   │   ├── VariationOrderWidget.tsx
│   │   │   └── MonthlyDisbursementWidget.tsx
│   │   ├── hooks/useFinanceData.ts
│   │   ├── services/FinanceService.ts
│   │   ├── types/finance.types.ts
│   │   └── FinancePage.tsx
│   │
│   ├── contractorHealth/           # TAB 4
│   │   ├── components/
│   │   │   ├── HealthRadarWidget.tsx
│   │   │   ├── WorkloadHealthMatrixWidget.tsx
│   │   │   ├── CriteriaHeatmapWidget.tsx
│   │   │   ├── HealthScorecardWidget.tsx
│   │   │   └── EarlyWarningWidget.tsx
│   │   ├── hooks/useContractorHealth.ts
│   │   ├── services/ContractorHealthService.ts
│   │   ├── utils/calculateHealthScore.ts
│   │   ├── types/contractorHealth.types.ts
│   │   └── ContractorHealthPage.tsx
│   │
│   └── kiosk/                      # Chế độ trình chiếu
│       ├── hooks/
│       │   ├── useAutoRotateTab.ts
│       │   ├── usePerformanceGuard.ts
│       │   └── useIdleDetection.ts
│       └── slices/kioskSlice.ts
│
├── shared/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardShell.tsx      # Header + KPI strip + outlet
│   │   │   ├── AppHeader.tsx
│   │   │   ├── TabNavigation.tsx
│   │   │   ├── AuroraBackground.tsx    # Quầng sáng nền
│   │   │   └── DashboardGrid.tsx       # Lưới 12×9
│   │   ├── glass/
│   │   │   ├── GlassPanel.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   └── WidgetContainer.tsx     # Header + body + trạng thái
│   │   ├── charts/
│   │   │   ├── BaseChart.tsx           # Wrapper ECharts + theme
│   │   │   ├── SCurveChart.tsx
│   │   │   ├── BulletChart.tsx
│   │   │   ├── WaterfallChart.tsx
│   │   │   ├── TreemapChart.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   ├── HeatmapChart.tsx
│   │   │   └── echartsDarkTheme.ts
│   │   ├── kpi/
│   │   │   ├── KpiCard.tsx
│   │   │   ├── KpiStrip.tsx
│   │   │   ├── DeltaBadge.tsx
│   │   │   └── Sparkline.tsx
│   │   └── feedback/
│   │       ├── WidgetSkeleton.tsx
│   │       ├── WidgetError.tsx
│   │       └── WidgetEmpty.tsx
│   ├── hooks/
│   │   ├── useAutoRefresh.ts
│   │   ├── useFullscreen.ts
│   │   ├── useCountUp.ts
│   │   └── useResponsiveScale.ts
│   ├── services/
│   │   ├── HttpService.ts
│   │   └── SseService.ts
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── formatPercent.ts
│   │   ├── formatDate.ts
│   │   └── getStatusColor.ts
│   ├── constants/
│   │   ├── GRID_LAYOUT.ts
│   │   ├── COLOR_TOKENS.ts
│   │   ├── REFRESH_INTERVALS.ts
│   │   └── KPI_THRESHOLDS.ts
│   └── types/
│       ├── common.types.ts
│       └── api.types.ts
│
├── locales/
│   ├── vi/{common,overview,orgChart,finance,health}.json
│   └── en/{common,overview,orgChart,finance,health}.json
│
├── styles/
│   ├── globals.css
│   └── glass.css
│
└── main.tsx
```

### 11.4 Ví dụ triển khai — Widget Container

```tsx
// src/shared/components/glass/WidgetContainer.tsx
import { type ReactNode, memo } from 'react';
import { cn } from '@/shared/utils/cn';
import { WidgetSkeleton } from '@/shared/components/feedback/WidgetSkeleton';
import { WidgetError } from '@/shared/components/feedback/WidgetError';

/** Vị trí widget trên lưới 12 cột × 9 hàng của dashboard */
export interface IGridPosition {
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
}

export interface IWidgetContainerProps {
  /** Tiêu đề widget, hiển thị ở header */
  title: string;
  /** Icon đứng trước tiêu đề */
  icon?: ReactNode;
  /** Mô tả phụ dưới tiêu đề (thường là thời điểm cập nhật) */
  subtitle?: string;
  /** Nội dung góc phải header: badge cảnh báo, bộ lọc… */
  headerRight?: ReactNode;
  /** Vùng chú thích dưới cùng */
  footer?: ReactNode;
  position: IGridPosition;
  isLoading?: boolean;
  error?: Error | null;
  /** Dữ liệu quá cũ so với chu kỳ làm mới → giảm nổi bật + gắn nhãn */
  isStale?: boolean;
  onRetry?: () => void;
  children: ReactNode;
}

/**
 * Khung kính chuẩn cho mọi widget của dashboard.
 * Đảm nhiệm định vị trên lưới, hiệu ứng glassmorphism và 4 trạng thái
 * hiển thị (loading / error / stale / ready) để các widget con không phải lặp lại.
 */
export const WidgetContainer = memo<IWidgetContainerProps>(
  ({
    title,
    icon,
    subtitle,
    headerRight,
    footer,
    position,
    isLoading = false,
    error = null,
    isStale = false,
    onRetry,
    children,
  }) => {
    const { colStart, colSpan, rowStart, rowSpan } = position;

    return (
      <section
        className={cn(
          'glass-panel flex flex-col overflow-hidden',
          'transition-opacity duration-300',
          isStale && 'opacity-70',
        )}
        // Vị trí lưới là dữ liệu động nên bắt buộc dùng style inline;
        // Tailwind không sinh được class từ giá trị runtime.
        style={{
          gridColumn: `${colStart} / span ${colSpan}`,
          gridRow: `${rowStart} / span ${rowSpan}`,
        }}
        aria-busy={isLoading}
      >
        <header className="flex shrink-0 items-start justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            {icon && <span className="text-accent">{icon}</span>}
            <div>
              <h2 className="text-heading-md text-slate-100">{title}</h2>
              {subtitle && (
                <p className="text-caption text-slate-500">{subtitle}</p>
              )}
            </div>
          </div>
          {headerRight}
        </header>

        <div className="mx-6 h-px shrink-0 bg-white/[0.08]" />

        <div className="min-h-0 flex-1 px-6 py-4">
          {isLoading && <WidgetSkeleton />}
          {!isLoading && error && <WidgetError error={error} onRetry={onRetry} />}
          {!isLoading && !error && children}
        </div>

        {footer && (
          <footer className="shrink-0 px-6 pb-4 text-caption text-slate-500">
            {footer}
          </footer>
        )}
      </section>
    );
  },
);

WidgetContainer.displayName = 'WidgetContainer';
```

### 11.5 Ví dụ triển khai — Hook lấy dữ liệu với SWR

```ts
// src/features/overview/hooks/useDocumentProgress.ts
import useSWR from 'swr';
import { OverviewService } from '@/features/overview/services/OverviewService';
import { REFRESH_INTERVALS } from '@/shared/constants/REFRESH_INTERVALS';
import type { IDocumentProgress } from '@/features/overview/types/overview.types';

export interface IUseDocumentProgressParams {
  projectId: string;
  /** Lọc theo gói thầu; bỏ trống = toàn dự án */
  packageId?: string;
  granularity: 'week' | 'month';
}

export interface IUseDocumentProgressResult {
  data: IDocumentProgress | undefined;
  isLoading: boolean;
  error: Error | undefined;
  /** Dữ liệu cũ hơn 2 lần chu kỳ làm mới → widget hiển thị nhãn cảnh báo */
  isStale: boolean;
  refresh: () => void;
}

/**
 * Lấy dữ liệu S-Curve tiến độ hồ sơ (baseline / thực tế / dự báo).
 * Dùng `keepPreviousData` để biểu đồ không nháy trắng mỗi lần tự làm mới —
 * điều bắt buộc với màn hình TV hiển thị liên tục.
 */
export const useDocumentProgress = ({
  projectId,
  packageId,
  granularity,
}: IUseDocumentProgressParams): IUseDocumentProgressResult => {
  const { data, error, isLoading, mutate } = useSWR<IDocumentProgress, Error>(
    ['document-progress', projectId, packageId, granularity],
    () => OverviewService.getDocumentProgress({ projectId, packageId, granularity }),
    {
      refreshInterval: REFRESH_INTERVALS.DOCUMENT_PROGRESS,
      keepPreviousData: true,
      revalidateOnFocus: false,
      errorRetryCount: 5,
      errorRetryInterval: 10_000,
    },
  );

  const isStale = Boolean(
    data &&
      Date.now() - new Date(data.generatedAt).getTime() >
        REFRESH_INTERVALS.DOCUMENT_PROGRESS * 2,
  );

  return { data, isLoading, error, isStale, refresh: () => void mutate() };
};
```

### 11.6 Chu kỳ làm mới dữ liệu

```ts
// src/shared/constants/REFRESH_INTERVALS.ts

/** Chu kỳ tự làm mới của từng nhóm dữ liệu (mili giây). */
export const REFRESH_INTERVALS = {
  KPI_STRIP: 5 * 60_000,
  DOCUMENT_PROGRESS: 15 * 60_000,
  PACKAGE_STATUS: 15 * 60_000,
  UNIT_RANKING: 15 * 60_000,
  RISKS: 10 * 60_000,
  SITE_PHOTOS: 5 * 60_000,
  MAP_LAYERS: 30 * 60_000,
  MILESTONES: 60 * 60_000,
  ORG_CHART: 6 * 60 * 60_000,
  FINANCE: 30 * 60_000,
  CONTRACTOR_HEALTH: 60 * 60_000,
} as const;
```

> **Nguyên tắc**: Lệch pha (stagger) các chu kỳ để tránh 9 request cùng lúc gây đơ giao diện. Backend nên trả **1 endpoint tổng hợp cho mỗi tab** (BFF pattern) thay vì 9 request riêng lẻ.

### 11.7 Backend — NestJS

**Vì sao NestJS thay vì Express thuần?**

| Tiêu chí | NestJS |
|---|---|
| TypeScript | Native, decorator-based, DTO validation với `class-validator` |
| Cấu trúc | Module hóa theo domain — khớp với feature-based ở FE |
| Tích hợp | `@nestjs/schedule` (cron ETL), `@nestjs/bull` (queue), `@nestjs/cache-manager` (Redis) |
| API docs | Swagger tự sinh — quan trọng khi tích hợp với CDE/ERP của bên thứ ba |

**Module chính:**

```
apps/api/src/
├── modules/
│   ├── overview/       # BFF endpoint tổng hợp tab 1
│   ├── org-chart/
│   ├── finance/
│   ├── contractor-health/
│   ├── documents/      # Domain hồ sơ, tính OTS/FTAR/TAT
│   ├── risks/
│   ├── media/          # Ảnh công trường, resize pipeline
│   └── gis/            # Phục vụ GeoJSON / vector tile
├── integrations/
│   ├── cde/            # Adapter CDE (ACC / ProjectWise / Trimble)
│   ├── erp/
│   ├── schedule/       # P6 / MSP importer
│   └── excel/          # Import theo template
├── jobs/               # BullMQ workers, cron đồng bộ
└── common/             # Guards, interceptors, filters
```

**Nguyên tắc BFF**: mỗi tab = 1 endpoint, ví dụ `GET /api/v1/dashboard/overview?projectId=...` trả về toàn bộ dữ liệu 8 widget, đã tính toán sẵn, đã cache Redis. Frontend **không tính toán KPI** — mọi công thức nằm ở backend để đảm bảo nhất quán giữa các thiết bị.

### 11.8 Hiệu năng cho chế độ TV 24/7

| Vấn đề | Giải pháp |
|---|---|
| Rò rỉ bộ nhớ sau nhiều giờ | Cleanup `echarts.dispose()` khi unmount; `useEffect` cleanup cho mọi timer; tự `location.reload()` lúc 03:00 hằng đêm |
| `backdrop-filter` nặng | Giới hạn ≤ 10 phần tử; `--perf-mode` tự bật khi FPS < 30 |
| Chart re-render thừa | `React.memo` + `useMemo` cho `option` object; ECharts `notMerge: false` để animate mượt |
| Ảnh nặng | Resize backend, WebP/AVIF, `loading="lazy"`, preload ảnh kế tiếp trong carousel |
| Burn-in màn OLED | Dịch chuyển toàn bộ layout ±2px mỗi 10 phút (pixel shift); không dùng vùng trắng tĩnh lớn |
| Mất mạng | Service Worker cache response cuối; hiển thị dữ liệu cache + badge "Offline" |
| Tab ẩn bị throttle | Dùng `document.visibilityState` để tạm dừng animation, không tạm dừng fetch |

**Ngân sách hiệu năng (Performance Budget):**

| Chỉ tiêu | Mục tiêu |
|---|---|
| First Contentful Paint | < 1,5 s |
| Time to Interactive | < 3,0 s |
| Bundle JS (gzip, initial) | < 400 KB |
| FPS khi chuyển tab | ≥ 50 |
| Bộ nhớ sau 24 giờ | < 800 MB, không tăng đơn điệu |

---

## 12. MÔ HÌNH DỮ LIỆU & API CONTRACT

### 12.1 Sơ đồ thực thể chính

```
Project (Dự án)
 └── Cluster (Cụm dự án)          — cao tốc / cầu / hầm / nút giao
      └── Package (Gói thầu)      — XL-01, TV-02…
           ├── Contract (Hợp đồng)
           │    └── Payment (Thanh toán) · VariationOrder (Phát sinh)
           ├── Organization (Đơn vị)  ⟷ PackageRole (Vai trò trong gói)
           │    └── Contact (Đầu mối)
           ├── Document (Hồ sơ)
           │    └── DocumentRevision (Lần trình)
           ├── Issue / Risk
           ├── Milestone (Mốc)
           ├── SitePhoto (Ảnh công trường)
           └── ProgressSnapshot (Ảnh chụp tiến độ theo kỳ)

HealthScoreSnapshot (Điểm sức khỏe theo kỳ)  ⟵ Organization × Period
GisFeature (Đối tượng bản đồ)                ⟵ Package (geometry)
```

### 12.2 Định nghĩa kiểu dữ liệu (TypeScript)

```ts
// src/shared/types/common.types.ts

/** Mức trạng thái dùng chung để tô màu toàn hệ thống. */
export type TStatusLevel = 'good' | 'normal' | 'warning' | 'danger' | 'critical';

/** Chiều biến động của một chỉ số so với kỳ trước. */
export type TTrendDirection = 'up' | 'down' | 'flat';

export interface IDeltaValue {
  value: number;
  /** true nếu chiều biến động này là tích cực (dùng để chọn màu, không suy từ dấu) */
  isPositive: boolean;
  direction: TTrendDirection;
  /** Mốc so sánh, ví dụ "so với tháng trước" */
  comparedTo: string;
}

export interface IKpiMetric {
  key: string;
  label: string;
  value: number;
  unit: string;
  formatted: string;
  status: TStatusLevel;
  delta?: IDeltaValue;
  /** Chuỗi giá trị 12 kỳ gần nhất để vẽ sparkline */
  sparkline?: number[];
}
```

```ts
// src/features/overview/types/overview.types.ts
import type { IKpiMetric, TStatusLevel } from '@/shared/types/common.types';

/** Một điểm trên đường S-Curve tiến độ hồ sơ. */
export interface IDocumentProgressPoint {
  /** Nhãn kỳ, ví dụ "2026-W33" hoặc "2026-08" */
  period: string;
  date: string;
  /** Số hồ sơ phải nộp lũy kế theo kế hoạch gốc */
  baselineCumulative: number;
  /** Số hồ sơ đã nộp lũy kế thực tế; null với kỳ tương lai */
  actualCumulative: number | null;
  /** Dự báo lũy kế; null với kỳ quá khứ */
  forecastCumulative: number | null;
  /** Số hồ sơ nộp riêng trong kỳ (vẽ dạng cột) */
  submittedInPeriod: number;
}

export interface IDocumentProgress {
  projectId: string;
  granularity: 'week' | 'month';
  points: IDocumentProgressPoint[];
  summary: {
    totalRequired: number;
    totalSubmitted: number;
    /** Chênh lệch so với baseline, đơn vị: số hồ sơ */
    varianceCount: number;
    /** Quy đổi chênh lệch ra số tuần — con số lãnh đạo quan tâm nhất */
    varianceWeeks: number;
    /** Ngày hoàn thành dự báo (ISO) */
    forecastCompletionDate: string;
    /** Số ngày trễ so với kế hoạch; âm nghĩa là sớm hơn */
    forecastDelayDays: number;
    onTimeSubmissionRate: number;
    firstTimeApprovalRate: number;
  };
  generatedAt: string;
}

/** Một gói thầu trong bảng xếp hạng chậm hồ sơ. */
export interface IDelayedPackage {
  packageId: string;
  packageCode: string;
  packageName: string;
  contractorName: string;
  scopeLabel: string;
  submittedCount: number;
  requiredCount: number;
  submissionRate: number;
  /** Mốc mục tiêu tại thời điểm hiện tại, dùng vẽ vạch bullet chart */
  targetRate: number;
  /** Số ngày chậm bình quân có trọng số theo mức quan trọng của hồ sơ */
  weightedDelayDays: number;
  status: TStatusLevel;
}

/** Một đơn vị trong bảng xếp hạng tư vấn / nhà thầu. */
export interface IUnitRanking {
  rank: number;
  organizationId: string;
  organizationName: string;
  logoUrl: string | null;
  role: 'designer' | 'contractor' | 'supervisor';
  submittedCount: number;
  requiredCount: number;
  submissionRate: number;
  firstTimeApprovalRate: number;
  /** Điểm xếp hạng = 0.6 × submissionRate + 0.4 × firstTimeApprovalRate */
  compositeScore: number;
  rankChange: number;
  status: TStatusLevel;
}

export interface IRiskItem {
  riskId: string;
  title: string;
  packageCode: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  /** likelihood × impact, khoảng 1..25 */
  riskScore: number;
  ownerName: string;
  openedDays: number;
  status: 'open' | 'mitigating' | 'closed';
}

/** Dữ liệu tổng hợp cho toàn bộ Tab Tổng quan (BFF pattern). */
export interface IOverviewDashboard {
  kpis: IKpiMetric[];
  documentProgress: IDocumentProgress;
  delayedPackages: IDelayedPackage[];
  designerRanking: IUnitRanking[];
  contractorRanking: IUnitRanking[];
  topRisks: IRiskItem[];
  riskMatrix: number[][];
  sitePhotos: ISitePhoto[];
  milestones: IMilestone[];
  projectInfo: IProjectInfo;
  generatedAt: string;
}
```

```ts
// src/features/contractorHealth/types/contractorHealth.types.ts

/** Sáu trụ cột cấu thành điểm sức khỏe của một đơn vị. */
export interface IHealthPillars {
  progress: number;
  document: number;
  quality: number;
  safety: number;
  resource: number;
  finance: number;
}

/** Trọng số từng trụ cột; tổng phải bằng 1. Cấu hình được ở màn hình quản trị. */
export interface IHealthWeights extends IHealthPillars {}

export type THealthBand = 'excellent' | 'good' | 'watch' | 'risk' | 'critical';

export interface IContractorHealth {
  organizationId: string;
  organizationName: string;
  logoUrl: string | null;
  role: string;
  pillars: IHealthPillars;
  totalScore: number;
  band: THealthBand;
  /** Điểm 6 kỳ gần nhất để vẽ sparkline xu hướng */
  history: number[];
  scoreChange: number;
  rank: number;
  rankChange: number;
  /** Tổng giá trị hợp đồng đang đảm nhận (tỷ đồng) — trục Y của bubble chart */
  workloadValue: number;
  packageCount: number;
}

export interface IEarlyWarning {
  warningId: string;
  organizationId: string;
  organizationName: string;
  severity: 'high' | 'medium';
  title: string;
  /** Các nguyên nhân được rule engine phát hiện */
  reasons: string[];
  recommendation: string;
  dueDate: string | null;
}
```

### 12.3 Danh mục Endpoint

| Method | Endpoint | Mô tả | Cache TTL |
|---|---|---|---|
| GET | `/api/v1/dashboard/overview` | Toàn bộ dữ liệu Tab 1 | 5 phút |
| GET | `/api/v1/dashboard/org-chart` | Cây tổ chức theo cụm | 60 phút |
| GET | `/api/v1/dashboard/finance` | Toàn bộ dữ liệu Tab 3 | 15 phút |
| GET | `/api/v1/dashboard/contractor-health` | Toàn bộ dữ liệu Tab 4 | 30 phút |
| GET | `/api/v1/gis/alignment` | GeoJSON tim tuyến + phân đoạn | 60 phút |
| GET | `/api/v1/media/site-photos` | Danh sách ảnh mới nhất | 5 phút |
| GET | `/api/v1/config/dashboard-layout` | Cấu hình lưới widget | 60 phút |
| GET | `/api/v1/stream/events` | SSE: cảnh báo mới, ảnh mới, đổi trạng thái | — |

**Định dạng phản hồi chuẩn:**

```ts
export interface IApiResponse<TData> {
  success: boolean;
  data: TData;
  meta: {
    generatedAt: string;
    /** Thời điểm đồng bộ gần nhất từ hệ thống nguồn */
    sourceSyncedAt: string;
    cacheHit: boolean;
    /** Nguồn dữ liệu để hiển thị nhãn "Nguồn: CDE" khi cần */
    sources: string[];
  };
  error: { code: string; message: string } | null;
}
```

---

## 13. CHẾ ĐỘ KIOSK / TV MODE

### 13.1 Tính năng bắt buộc

| Tính năng | Mô tả |
|---|---|
| **Auto-rotate tab** | Xoay vòng 4 tab, thời lượng cấu hình riêng từng tab (mặc định 60/40/45/45 giây) |
| **Thanh tiến trình xoay tab** | Thanh mảnh 3px dưới tab bar, chạy dần → người xem biết sắp chuyển |
| **Tạm dừng khi tương tác** | Chạm/di chuột → tạm dừng auto-rotate 3 phút, hiện nút "Tiếp tục" |
| **Ưu tiên cảnh báo** | Khi có cảnh báo nghiêm trọng mới → tự nhảy sang tab liên quan, giữ 20 giây, viền màn hình phát sáng đỏ |
| **Tự vào Fullscreen** | Tự gọi `requestFullscreen()` sau lần tương tác đầu tiên; ẩn con trỏ chuột sau 5 giây bất động |
| **Đồng hồ & trạng thái dữ liệu** | Góc phải header: giờ, ngày, chấm trạng thái kết nối (xanh/vàng/đỏ), "Cập nhật x phút trước" |
| **Tự khôi phục** | Nếu tab crash hoặc mất mạng > 5 phút → tự reload |
| **Reload định kỳ** | 03:00 hằng đêm reload sạch để giải phóng bộ nhớ |
| **Pixel shift** | Dịch layout ±2px mỗi 10 phút chống burn-in |
| **Điều khiển từ xa** | Phím mũi tên trái/phải đổi tab, `Space` tạm dừng, `F` fullscreen, `R` reload — dùng được với remote/presenter |
| **QR mở trên điện thoại** | Góc dưới phải: QR nhỏ để lãnh đạo mở bản mobile xem chi tiết |

### 13.2 Cấu hình kiosk (Redux slice)

```ts
// src/features/kiosk/slices/kioskSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TDashboardTab = 'overview' | 'orgChart' | 'finance' | 'contractorHealth';

export interface IKioskState {
  isKioskMode: boolean;
  isRotating: boolean;
  activeTab: TDashboardTab;
  /** Thời lượng dừng tại mỗi tab (giây) */
  rotationDurations: Record<TDashboardTab, number>;
  /** Tạm dừng xoay tab tới thời điểm này (epoch ms); null = không tạm dừng */
  pausedUntil: number | null;
  /** Ẩn tên đơn vị trong bảng xếp hạng khi có khách */
  anonymizeUnits: boolean;
  /** Tắt hiệu ứng nặng khi thiết bị yếu */
  isPerfMode: boolean;
}

const initialState: IKioskState = {
  isKioskMode: false,
  isRotating: true,
  activeTab: 'overview',
  rotationDurations: {
    overview: 60,
    orgChart: 40,
    finance: 45,
    contractorHealth: 45,
  },
  pausedUntil: null,
  anonymizeUnits: false,
  isPerfMode: false,
};

const kioskSlice = createSlice({
  name: 'kiosk',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TDashboardTab>) => {
      state.activeTab = action.payload;
    },
    /** Tạm dừng xoay tab sau khi người dùng chạm màn hình */
    pauseRotation: (state, action: PayloadAction<number>) => {
      state.pausedUntil = Date.now() + action.payload * 1000;
    },
    resumeRotation: (state) => {
      state.pausedUntil = null;
    },
    toggleAnonymize: (state) => {
      state.anonymizeUnits = !state.anonymizeUnits;
    },
    setPerfMode: (state, action: PayloadAction<boolean>) => {
      state.isPerfMode = action.payload;
    },
  },
});

export const {
  setActiveTab,
  pauseRotation,
  resumeRotation,
  toggleAnonymize,
  setPerfMode,
} = kioskSlice.actions;

export const kioskReducer = kioskSlice.reducer;
```

### 13.3 Chuyển tab — hiệu ứng

Không dùng slide ngang (gây chóng mặt trên màn hình lớn). Dùng **cross-fade + scale nhẹ**:

```
Tab cũ:  opacity 1 → 0,  scale 1 → 0.98,  200ms
Tab mới: opacity 0 → 1,  scale 1.02 → 1,  300ms (delay 100ms)
Widget:  stagger 40ms mỗi widget theo thứ tự quét mắt Z
```

### 13.4 Thích ứng thiết bị

| Breakpoint | Xử lý |
|---|---|
| ≥ 3840px (4K) | Scale toàn bộ 2×, giữ nguyên lưới 12×9 |
| 1920 – 3839 | Lưới chuẩn 12×9 |
| 1440 – 1919 | Lưới 12×9, giảm font 1 bậc, giảm padding còn 16px |
| 1024 – 1439 (tablet ngang) | Lưới 12×9 → **tách mỗi tab thành 2 trang con**, vuốt ngang để chuyển; hiện chấm chỉ báo trang |
| < 1024 (mobile) | Chế độ danh sách dọc, cho phép cuộn — chỉ dùng để tra cứu, không phải trình chiếu |

---

## 14. LỘ TRÌNH TRIỂN KHAI

| Giai đoạn | Thời lượng | Phạm vi | Kết quả bàn giao |
|---|---|---|---|
| **P0 — Thống nhất & Thiết kế** | 2 tuần | Chốt bộ KPI, công thức, nguồn dữ liệu; wireframe hi-fi 4 tab trên Figma; design system | Figma + Data dictionary + API spec |
| **P1 — Nền tảng** | 3 tuần | Dựng shell (header, tab, lưới, glass), design system code, mock data, ECharts theme, i18n | Dashboard chạy với dữ liệu giả, đúng 100% giao diện |
| **P2 — Tab 1 Tổng quan** | 4 tuần | 8 widget + bản đồ GIS + tích hợp CDE thực | Tab 1 dùng dữ liệu thật |
| **P3 — Tab 3 Tài chính** | 3 tuần | 7 widget + tích hợp ERP/Excel | Tab 3 dùng dữ liệu thật |
| **P4 — Tab 2 Org + Tab 4 Sức khỏe** | 4 tuần | Org tree, RACI, mô hình chấm điểm, rule cảnh báo | Tab 2, 4 hoàn chỉnh |
| **P5 — Kiosk & Tối ưu** | 2 tuần | Auto-rotate, perf mode, offline, pixel shift, kiểm thử 72 giờ liên tục | Sẵn sàng lắp TV |
| **P6 — Vận hành thử & Hiệu chỉnh** | 3 tuần | Chạy thật, thu phản hồi lãnh đạo, tinh chỉnh ngưỡng & trọng số | Go-live |

**Tổng: ~21 tuần (≈ 5 tháng)** cho V1 đầy đủ.

### Đề xuất MVP rút gọn (7 tuần)

Nếu cần demo sớm cho lãnh đạo:

| Tuần | Nội dung |
|---|---|
| 1–2 | Shell + Design system + Mock data toàn bộ 4 tab |
| 3–5 | Tab 1 với dữ liệu thật (KPI strip, S-curve, Top gói chậm, Xếp hạng, Rủi ro, Ảnh) — bản đồ dùng ảnh tĩnh + marker trước |
| 6 | Tab 3 Tài chính từ Excel import |
| 7 | Kiosk mode + đưa lên TV |

Tab 2 và Tab 4 dùng mock data thuyết phục để trình bày ý tưởng, làm thật ở giai đoạn sau.

---

## 15. RỦI RO & KHUYẾN NGHỊ

### 15.1 Rủi ro dự án

| # | Rủi ro | Mức | Giảm thiểu |
|---|---|---|---|
| R1 | **Chất lượng dữ liệu nguồn kém** — CDE nhập không đủ, hồ sơ không gắn deadline, không phân loại | 🔴 Cao | Đây là **rủi ro số 1**. Trước khi code, phải kiểm toán dữ liệu CDE. Ban hành quy định bắt buộc trường dữ liệu. Có màn hình "Chất lượng dữ liệu" cho admin theo dõi % bản ghi đầy đủ |
| R2 | **Không có baseline hồ sơ** — không biết "phải nộp bao nhiêu, khi nào" | 🔴 Cao | Phải xây **Document Delivery Plan (DDP)** trước. Không có baseline thì S-curve vô nghĩa |
| R3 | Tranh cãi về bảng xếp hạng đơn vị | 🟠 TB | Công bố công thức & trọng số trước; có chế độ ẩn danh; cho phép đơn vị phản hồi số liệu |
| R4 | Hiệu năng glassmorphism trên TV box yếu | 🟠 TB | Perf mode tự động; test sớm trên đúng thiết bị sẽ triển khai (không chỉ test trên máy dev) |
| R5 | Tích hợp GIS phức tạp, dữ liệu tuyến không chuẩn | 🟠 TB | Giai đoạn 1 dùng ảnh nền tĩnh + marker; nâng cấp vector tile sau |
| R6 | Dashboard đẹp nhưng không ai dùng | 🟠 TB | Gắn vào **quy trình giao ban**: mở dashboard đầu mỗi cuộc họp giao ban tuần. Không có nghi thức sử dụng thì dashboard sẽ chết |
| R7 | Tổng thầu/nhà thầu không hợp tác cung cấp dữ liệu | 🟡 Thấp | Đưa nghĩa vụ cập nhật CDE vào điều khoản hợp đồng và tiêu chí thanh toán |

### 15.2 Khuyến nghị chiến lược

1. **Ưu tiên tuyệt đối cho dữ liệu, không phải giao diện.** Một dashboard đẹp với dữ liệu sai còn tệ hơn không có dashboard. Dành 30% ngân sách dự án cho việc chuẩn hóa và làm sạch dữ liệu nguồn.

2. **Xây "Data Dictionary" trước khi code.** Mỗi chỉ số phải có: định nghĩa, công thức, nguồn, chủ sở hữu dữ liệu, tần suất cập nhật, ngưỡng cảnh báo. Đây là tài liệu quan trọng nhất của dự án.

3. **Bổ sung Tab "Tiến độ thi công" ngay ở V1.5.** Lãnh đạo sẽ hỏi ngay trong buổi demo đầu tiên. Chuẩn bị sẵn kiến trúc để thêm tab thứ 5.

4. **Đừng bỏ qua GPMB.** Với dự án cao tốc tại Việt Nam, GPMB là nguyên nhân chậm tiến độ số 1. Tối thiểu phải có 1 KPI GPMB trong Global KPI Strip.

5. **Thiết kế trước cho drill-down, làm sau.** Kiến trúc widget nên hỗ trợ `onClick → mở drawer chi tiết` ngay từ đầu, dù V1 chưa làm. Sửa sau rất tốn kém.

6. **Chốt thiết bị TV trước khi phát triển.** Kích thước, độ phân giải, hệ điều hành (Android TV / Windows mini PC / Chrome box), cấu hình GPU — ảnh hưởng trực tiếp đến quyết định về glassmorphism và bản đồ WebGL.

7. **Có phiên bản in/PDF.** Lãnh đạo thường yêu cầu "in cái này ra". Chuẩn bị chức năng xuất báo cáo A3 từ chính dữ liệu dashboard.

---

## 16. DANH SÁCH CÂU HỎI CẦN CHỐT

Trước khi bước sang giai đoạn wireframe chi tiết, cần thống nhất các điểm sau:

### Về nghiệp vụ

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| Q1 | Dự án có bao nhiêu **cụm dự án** và **gói thầu**? Danh sách cụ thể? | Quyết định bố cục Top N, cấu trúc org tree |
| Q2 | Hệ thống **CDE** đang dùng là gì? (Autodesk ACC / ProjectWise / Trimble / tự xây) Có API mở không? | Quyết định adapter tích hợp |
| Q3 | Đã có **Document Delivery Plan (baseline hồ sơ)** chưa? Ai quản lý? | **Quan trọng nhất** — không có thì không vẽ được S-curve |
| Q4 | Phân loại hồ sơ theo những nhóm nào? (BVTC, biện pháp thi công, vật liệu, nghiệm thu, thanh toán…) | Bộ lọc widget S-curve |
| Q5 | "Issue" trên CDE đã có trường **Likelihood/Impact** chưa, hay cần ánh xạ từ priority? | Cách tính RiskScore |
| Q6 | Dữ liệu tài chính lấy từ đâu? Có API hay phải import Excel? Chu kỳ cập nhật? | Kiến trúc ETL Tab 3 |
| Q7 | Đã có dữ liệu **HSE, NCR, chất lượng** dạng số chưa? | Khả thi của Tab 4 |
| Q8 | Có dữ liệu **GIS tuyến** dạng shapefile/GeoJSON chưa? Hệ tọa độ (VN2000 hay WGS84)? | Cần chuyển đổi tọa độ hay không |
| Q9 | Ảnh công trường được thu thập bằng cách nào hiện nay? | Thiết kế pipeline media |
| Q10 | Trọng số 6 trụ cột sức khỏe do ai phê duyệt? Có công bố cho nhà thầu không? | Tính chấp nhận của Tab 4 |

### Về kỹ thuật & vận hành

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| Q11 | TV sẽ dùng loại nào? Kích thước, độ phân giải, thiết bị phát (Android TV box / mini PC)? | Quyết định perf budget |
| Q12 | Hệ thống chạy on-premise hay cloud? Có yêu cầu bảo mật đặc biệt không? | Kiến trúc hạ tầng |
| Q13 | Có cần đăng nhập không, hay TV chạy chế độ công khai trong mạng nội bộ? | Thiết kế auth |
| Q14 | Có cần tiếng Anh không (báo cáo nhà tài trợ ODA)? | Khối lượng i18n |
| Q15 | Số người dùng đồng thời dự kiến? | Sizing hạ tầng |
| Q16 | Có yêu cầu xuất báo cáo PDF/Excel không? | Phạm vi V1 |

---

## PHỤ LỤC A — Bảng tra cứu loại biểu đồ

| Mục đích | Loại chart nên dùng | Nên tránh |
|---|---|---|
| So sánh thực tế vs kế hoạch theo thời gian | S-Curve (line + area) | Bar chart chồng |
| Xếp hạng Top N | Bullet chart ngang / Bar ngang | Bar dọc (tên bị xoay, khó đọc trên TV) |
| Tỷ trọng cấu thành (> 5 hạng mục) | **Treemap** | Pie / Donut nhiều lát |
| Tỷ trọng cấu thành (≤ 4 hạng mục) | Donut với số ở giữa | Pie 3D (tuyệt đối không) |
| Dòng chảy giá trị qua các giai đoạn | Waterfall | Bảng số |
| So sánh đa tiêu chí giữa vài đối tượng | Radar (≤ 3 series) | Parallel coordinates (khó đọc trên TV) |
| Ma trận 2 chiều nhiều đối tượng | Heatmap | Bảng số có màu nền |
| Định vị đối tượng theo 2 trục + 1 kích thước | Bubble / Scatter 4 góc phần tư | Bảng nhiều cột |
| Tiến trình theo thời gian có mốc | Timeline ngang | Gantt đầy đủ (quá chi tiết cho lãnh đạo) |
| Một chỉ số so ngưỡng | KPI card + sparkline | Gauge đồng hồ (tốn diện tích, ít thông tin) |
| Phân bố theo không gian | Bản đồ GIS | Bảng theo Km |
| Cơ cấu tổ chức phân cấp | Tree ngang (React Flow) | Tree dọc (tràn ngang) |

## PHỤ LỤC B — Checklist đánh giá thiết kế

Dùng checklist này để nghiệm thu từng tab:

- [ ] Toàn bộ nội dung vừa trong 1 màn hình 1920×1080, **không có thanh cuộn**
- [ ] Số widget ≤ 9
- [ ] Mọi chữ ≥ 18px; số KPI chính ≥ 64px
- [ ] Mỗi con số đều có ngữ cảnh (delta / ngưỡng / mục tiêu)
- [ ] Màu delta phản ánh **hướng tốt/xấu**, không phải tăng/giảm
- [ ] Mọi số dùng `tabular-nums`, không nhảy khi cập nhật
- [ ] Có timestamp "cập nhật lúc" ở header
- [ ] Mọi widget có đủ 4 trạng thái: loading / empty / error / stale
- [ ] Widget lỗi vẫn hiện dữ liệu cache, không để trống
- [ ] Chỉ ≤ 10 phần tử dùng `backdrop-filter`
- [ ] Đạt ≥ 50 FPS khi chuyển tab trên thiết bị đích
- [ ] Tương phản chữ/nền ≥ 4.5:1 (WCAG AA)
- [ ] Không dùng màu là kênh truyền tin duy nhất (luôn kèm icon/nhãn) — phòng người xem mù màu
- [ ] Chạy liên tục 72 giờ không tăng bộ nhớ đơn điệu

---

*Tài liệu V0 — soạn để thảo luận. Sau khi thống nhất nội dung, bước tiếp theo là dựng wireframe hi-fi trên Figma và lập Data Dictionary chi tiết.*
