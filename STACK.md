# Tech Stack

> Complete technology overview for [RepoReef](https://reporeef.com) — a platform where developers discover open source projects, collaborate with teams, and find teammates.

---

## 📦 Hosting & Deployment

| Service         | Purpose                                                 | Plan        |
| :-------------- | :------------------------------------------------------ | :---------- |
| **Vercel**      | Frontend hosting — [reporeef.com](https://reporeef.com) | Free        |
| **Contabo VPS** | Backend hosting (planned)                               | Cloud VPS 1 |
| **Neon**        | Serverless PostgreSQL                                   | Free        |
| **Cloudflare**  | DNS management + Email Routing                          | Free        |

---

## 🌐 Domain & DNS

| Service                      | Purpose                                  |
| :--------------------------- | :--------------------------------------- |
| **Cloudflare Registrar**     | `reporeef.com` domain registration       |
| **Cloudflare DNS**           | A/CNAME/MX/TXT records (DNS-only mode)   |
| **Cloudflare Email Routing** | Inbound email forwarding                 |
| **Google Search Console**    | Domain verification + sitemap submission |

> **Note:** Cloudflare proxy is **disabled** (grey cloud). Vercel provides its own CDN and DDoS protection — layering both causes SSL conflicts.

---

## 📧 Email Infrastructure

| Service                         | Purpose                              |
| :------------------------------ | :----------------------------------- |
| **Cloudflare Email Routing**    | MX records + inbound routing         |
| **Cloudflare DMARC Management** | SPF/DKIM/DMARC policies              |
| **Gmail**                       | Inbox + filter rules (DMARC reports) |

**Active addresses:**

- `hello@reporeef.com` — general contact
- `dmarc@reporeef.com` — DMARC aggregate reports

---

## 🔐 Authentication & Security

| Tool                         | Purpose                                           |
| :--------------------------- | :------------------------------------------------ |
| **GitHub OAuth 2.0**         | Passwordless authentication                       |
| **JWT (HS256)**              | 7-day sessions, no email in token (privacy-first) |
| **golang-jwt/jwt/v5**        | Token signing and verification                    |
| **golang.org/x/oauth2**      | OAuth flow implementation                         |
| **golang.org/x/time/rate**   | Per-IP rate limiting (token bucket)               |
| **Cloudflare Universal SSL** | HTTPS certificates                                |

---

## 🎨 Frontend

| Tool                                    | Purpose                                          |
| :-------------------------------------- | :----------------------------------------------- |
| **React 19**                            | UI framework                                     |
| **Vite 8**                              | Build tool                                       |
| **React Router v7**                     | Client-side routing                              |
| **Tailwind CSS v4**                     | Styling with custom design tokens                |
| **vite-plugin-geo**                     | Auto-generated sitemap.xml + robots.txt          |
| **Carter One / Inter / JetBrains Mono** | Typography (Google Fonts)                        |
| **Context API**                         | State management (Auth, Config, Language, Toast) |
| **Custom SVG Icons**                    | No emojis — all icons hand-crafted               |

---

## 🖥️ Backend

| Tool         | Purpose                                |
| :----------- | :------------------------------------- |
| **Go 1.26**  | Language                               |
| **Gin 1.12** | HTTP framework                         |
| **pgx/v5**   | PostgreSQL driver (no ORM, raw SQL)    |
| **godotenv** | Environment loading (development only) |

---

## 🗄️ Database

| Tool                 | Purpose                                          |
| :------------------- | :----------------------------------------------- |
| **Neon PostgreSQL**  | Serverless Postgres (pooled connection)          |
| **pgxpool**          | Connection pool (MaxConns: 10)                   |
| **Advisory Locks**   | Race condition prevention (project limits)       |
| **audit_logs table** | Critical action tracking (login, create, delete) |

**Schema highlights:**

- `project_contributors` — single source of truth (no denormalized columns)
- `max_contributors` — set at creation, immutable after
- `JWT without email` — privacy-first design

---

## 🐳 DevOps

| Tool                   | Purpose                                    |
| :--------------------- | :----------------------------------------- |
| **GitHub Actions**     | CI — build + vet + golangci-lint (backend) |
| **GitHub Actions**     | CI — build + lint (frontend)               |
| **Docker multi-stage** | Alpine runtime, non-root user, healthcheck |
| **Docker Compose**     | Single-service deployment (backend + Neon) |
| **`.dockerignore`**    | Prevents `.env` from entering image        |

---

## 🛡️ Security Layers

| Layer                        | Where    | What it does                                   |
| :--------------------------- | :------- | :--------------------------------------------- |
| **CORS**                     | Backend  | Strict origin allowlist (`FRONTEND_URL` + dev) |
| **Security Headers**         | Backend  | OWASP recommendations                          |
| **XSS Sanitization**         | Backend  | HTML tag stripping, `javascript:` removal      |
| **Input Validation**         | Backend  | Regex + length + min/max checks                |
| **SQL Injection Prevention** | Backend  | Parameterized queries only                     |
| **GitHub Repo Check**        | Backend  | Public verification via `git-upload-pack`      |
| **Image Validation**         | Backend  | GitHub-only, 2MB max, format whitelist         |
| **Field-Level Errors**       | Frontend | Auto-scroll + red flash + inline message       |
| **JWT without PII**          | Backend  | No email in token claims                       |

---

## 🎯 SEO & Discovery

| Tool                      | Purpose                                     |
| :------------------------ | :------------------------------------------ |
| **Google Search Console** | Domain verification + indexing              |
| **sitemap.xml**           | Auto-generated via `vite-plugin-geo`        |
| **robots.txt**            | Auto-generated via `vite-plugin-geo`        |
| **OG Meta Tags**          | Social sharing (Twitter, WhatsApp, Discord) |
| **Canonical URLs**        | Prevent duplicate content                   |

---

## 🌍 i18n & UX

| Tool                 | Purpose                                           |
| :------------------- | :------------------------------------------------ |
| **Custom i18n**      | EN + TR — `LanguageContext` + `translations/`     |
| **Toast System**     | Custom `useToast`, max 3 stacked, 4s auto-dismiss |
| **ConfirmModal**     | Custom — native `confirm()` is forbidden          |
| **FieldError**       | Custom — auto-scroll + flash + inline hint        |
| **useScale**         | User text-size preference (sm / md / lg)          |
| **useSearchHistory** | localStorage-backed recent searches               |

---

## 📁 Code Organization

| Aspect                | Approach                                                             |
| :-------------------- | :------------------------------------------------------------------- |
| **Repositories**      | Two separate repos: `reporeef` (frontend) + `reporeef-api` (backend) |
| **README.md**         | Full documentation in both repos                                     |
| **LICENSE**           | MIT (both repos)                                                     |
| **`.env.example`**    | Committed template                                                   |
| **`.gitignore`**      | Excludes `.env` and build artifacts                                  |
| **Commit convention** | Short, single-line, Turkish                                          |

---

## 🚧 Planned / Roadmap

| Tool                     | Purpose                   | ETA        |
| :----------------------- | :------------------------ | :--------- |
| **Sentry**               | Error tracking            | This week  |
| **zerolog / slog**       | Structured JSON logging   | This week  |
| **golang-migrate**       | Versioned DB migrations   | This week  |
| **UptimeRobot**          | Uptime monitoring         | This week  |
| **Sightengine**          | NSFW image moderation     | 2 weeks    |
| **Redis**                | Distributed rate limiting | 1-2 months |
| **Prometheus + Grafana** | Metrics + dashboards      | 3-6 months |
| **OpenTelemetry**        | Distributed tracing       | 6+ months  |

---

## 🧭 Design Principles

- **Dark-only** UI (no light mode planned)
- **Privacy-first** (no email in JWT, no password storage)
- **Two-layer validation** (frontend + backend always)
- **Stable error codes** (translated on the frontend)
- **No native browser dialogs** (`alert`, `confirm` forbidden)
- **Design tokens** — no hard-coded values
- **Fail-open** on non-critical external checks (image size, repo visibility)
- **Fail-closed** on security-critical checks (auth, ownership)

---

**Last updated:** 2026
