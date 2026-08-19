# Executive Dashboard — BFF (NestJS)

Backend-for-Frontend stub trả mock data cho 4 tab dashboard.

## Chạy

```bash
cd backend
npm install
npm run start:dev   # hot-reload, port 3000
```

## Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/v1/dashboard/overview` | Tổng quan |
| GET | `/api/v1/dashboard/org-chart` | Sơ đồ tổ chức |
| GET | `/api/v1/dashboard/finance` | Tài chính |
| GET | `/api/v1/dashboard/contractor-health` | Sức khỏe nhà thầu |

## Build

```bash
npm run build       # compile TS -> dist/
npm run start:prod  # chạy production từ dist/
```

## Ghi chú

- CORS enabled (mọi origin).
- Không auth, không secret.
- Mock data copy từ `frontend/src/mocks/*.json`.