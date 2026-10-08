# RepoReef

> A platform where developers discover open source projects, collaborate with teams, and find teammates.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Go](https://img.shields.io/badge/Go-1.26-00ADD8?logo=go&logoColor=white)](https://go.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)

**Live Demo:** [reporeef.com](https://reporeef.com)

---

## About

RepoReef is an open platform built for **project collaboration** — a place where developers
can share what they're building, discover projects from the community, join teams as
contributors, and find teammates for their next idea.

Instead of digging through scattered GitHub repos or Discord servers, RepoReef gives
developers one place to:

- Publish a project with a clean, structured page
- Receive join requests from developers who want to contribute
- Star and bookmark projects worth following
- Build a public profile showing all projects they own or contribute to

## Screenshots

### Home

![Home page](docs/screenshots/home.png)

### Project Detail

![Project detail page](docs/screenshots/project-detail.png)

### Dashboard

![User dashboard](docs/screenshots/dashboard.png)

### Mobile

<img src="docs/screenshots/mobile.png" alt="Mobile view" width="320" />

## Features

### Project Discovery

- Browse the latest community projects with pagination
- Filter by categories (up to 5, AND/OR match modes)
- Full-text search across titles and descriptions
- Compact / expanded card views
- Star projects to bookmark them

### User Accounts

- **GitHub OAuth** authentication (no passwords stored)
- JWT-based sessions (7-day expiry, no email in the token for privacy)
- Public user profiles with project and contributor stats
- Editable username and bio

### Project Management

- Create projects with title, description, long description, links, and cover image
- **GitHub-only cover images** — validated via `raw.githubusercontent.com`, max 2 MB
- **Public repo requirement** — the GitHub repo is verified as public before saving
- Choose a **contributor limit** at creation (5 / 10 / 20 / 50)
- Up to 10 projects per user
- Edit or delete your own projects
- Cover image preview before publishing

### Collaboration

- Send join requests to any project (with optional message for premium users)
- Project owners approve or reject requests
- Contributors appear on the project page with a badge
- Leave a project at any time; owners can remove contributors
- Dedicated dashboard to manage projects and incoming requests

### Platform

- Fully responsive dark-only UI (mobile + desktop)
- Internationalization: **English / Turkish**
- Adjustable text scale (small / medium / large)
- **Field-level error feedback** — invalid inputs scroll into view, flash red, and show inline hints
- Toast notifications, no native `alert()` or `confirm()`
- Design token system — consistent typography, spacing, radius

## Tech Stack

### Frontend

- **React 19** + **Vite 8**
- **React Router v7**
- **Tailwind CSS v4** with a custom design token system
- Context-based state (Auth, Config, Language, Toast)
- Deployed on **Vercel** — [reporeef.com](https://reporeef.com)

### Backend ([separate repo](https://github.com/eraygdev/reporeef-api))

- **Go 1.26** + **Gin**
- **pgx/v5** PostgreSQL driver
- **Neon** serverless PostgreSQL
- GitHub OAuth 2.0 + JWT (HS256)
- Rate limiting, security headers, input sanitization
- Structured error codes (translated on the frontend)
- GitHub repo visibility check via `git-upload-pack` (no API rate limit)
- Cover image validation: format, source, and size (2 MB)
- Multi-stage **Docker** build (alpine, non-root, healthcheck)

### Planned

- AI-powered category suggestion (reads project README, suggests tags)
- Notifications and comments
- Full-text search with `pg_trgm`
- Redis-backed rate limiting
- GitHub webhook-based contributor verification
- NSFW image moderation (Sightengine integration)

## Getting Started

### Prerequisites

- Node.js **v18+**
- npm or yarn
- A running backend — either the [official API](https://github.com/eraygdev/reporeef-api) locally, or point to a deployed instance

### Installation

```bash
# Clone the repository
git clone https://github.com/eraygdev/reporeef.git
cd reporeef

# Install dependencies
npm install

# Copy environment template and fill in your values
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080
```

Change this to your deployed backend URL when building for production.

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/        # Navbar, Sidebar, Footer, UserDropdown, UserSearch
│   ├── project/       # ProjectCard, JoinRequestModal, ContributorCard, ...
│   └── ui/            # Icons, Toast, ConfirmModal, FieldError, ...
├── context/           # AuthContext, ConfigContext
├── hooks/             # useDebounced, useScale, useSearchHistory, useProjectView
├── i18n/              # LanguageContext + en.js / tr.js translations
├── pages/
│   ├── auth/          # Login, Register, Callback
│   ├── legal/         # About, Privacy, Terms, Cookies
│   ├── project/       # Home, Create, Edit, Details
│   ├── settings/      # Account, Appearance, Notifications, Danger
│   └── user/          # Dashboard, Profile
├── theme/             # Design tokens
├── utils/             # errors.js, validators.js, color.js
└── index.css          # Tailwind theme + design tokens
```

## Architecture Notes

- **`project_contributors`** is the single source of truth for contributors — no denormalized `contributors` column on the projects table.
- **`max_contributors`** is chosen at project creation and **cannot be changed afterward** (intentional — prevents bait-and-switch on contributor expectations).
- **JWT contains no email** — privacy-first design. Only `user_id`, `username`, and `is_premium`.
- **Error handling**: backend returns stable error codes (e.g. `username_taken`), the frontend translates them via `extractErrorMessage(res, t)` — no raw server messages ever reach the user. Field-specific errors are mapped to their input and shown inline with auto-scroll.
- **Cover images are GitHub-only**: URLs are normalized to `raw.githubusercontent.com`, format-checked (no SVG — XSS risk), and size-checked (2 MB max). Backend uses a HEAD request with a 5-second timeout.
- **Repo visibility** is checked via `git-upload-pack` (returns 200 for public, 401/404 otherwise) — no GitHub API rate limit involved.
- **Design system** is locked: dark-only, four-color palette, three fonts (Carter One for logo, Inter for body, JetBrains Mono for metrics). No emojis — all icons are custom SVGs.

## Roadmap

### Done

- [x] Frontend foundation (Home, Project Detail, Navbar, Sidebar, Footer, 404)
- [x] GitHub OAuth + JWT authentication
- [x] Project creation, editing, deletion
- [x] Contributor join / approve / reject / remove flow
- [x] User dashboard (projects + incoming requests)
- [x] Public user profiles with stats
- [x] Search (projects + users) with debouncing and history
- [x] Category filtering (AND / OR modes)
- [x] i18n (English / Turkish) + text scale
- [x] Go REST API backend + Docker + CI
- [x] Design token system
- [x] Custom domain (reporeef.com) + SSL
- [x] SEO: sitemap, robots.txt, Google Search Console
- [x] GitHub-only cover images + repo public check + size limit
- [x] Field-level validation errors (auto-scroll + inline hints)
- [x] Rate limiting, security headers, XSS sanitization

### In Progress

- [ ] Backend deployment (VPS + Docker Compose)
- [ ] Contributor badges (First Contributor / Active / Super)
- [ ] NSFW image moderation

### Planned

- [ ] AI-powered category suggestion (reads project README)
- [ ] Notification system
- [ ] Comment system
- [ ] Redis-backed rate limiting
- [ ] User following
- [ ] Theme switcher (light mode)
- [ ] Full-text search with `pg_trgm`
- [ ] 2FA

## Contributing

Contributions are welcome. If you'd like to help:

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m "feat: add something"`)
4. Push to your branch (`git push origin feat/your-feature`)
5. Open a Pull Request

For larger changes, please open an issue first to discuss what you'd like to change.

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## Contact

**Eray** — [@eraygdev](https://github.com/eraygdev)
Email: hello@reporeef.com

---

## 🇹🇷 Türkçe

> Geliştiricilerin açık kaynak projeleri keşfettiği, ekiplerle iş birliği yaptığı ve ekip arkadaşı bulduğu bir platform.

**Canlı Demo:** [reporeef.com](https://reporeef.com)

### Hakkında

RepoReef, **proje iş birliği** için kurulmuş açık bir platformdur. Geliştiriciler üzerinde çalıştıkları projeleri paylaşabilir, topluluk projelerini keşfedebilir, katkıcı olarak ekiplere katılabilir ve yeni fikirleri için ekip arkadaşı bulabilir.

Dağınık GitHub repoları veya Discord sunucuları arasında gezinmek yerine RepoReef, geliştiricilere tek bir yerde şunları sunar:

- Projenizi temiz ve yapılandırılmış bir sayfa ile yayınlama
- Katkıda bulunmak isteyen geliştiricilerden başvuru alma
- Takip etmeye değer projeleri yıldızlama
- Sahip olduğunuz ve katkıda bulunduğunuz tüm projeleri gösteren herkese açık profil

### Öne Çıkan Özellikler

- **GitHub OAuth** ile giriş (şifre saklanmaz)
- Proje oluşturma, düzenleme ve silme
- **GitHub-only kapak görseli** — `raw.githubusercontent.com` üzerinden, en fazla 2 MB
- **Repo public kontrolü** — proje kaydedilmeden önce GitHub reposunun herkese açık olduğu doğrulanır
- **Katkıcı limiti** seçimi (5 / 10 / 20 / 50)
- Katılma başvurusu gönderme, onaylama, reddetme ve çıkarma
- Kategori filtreleme (VE / VEYA modları) ve tam metin arama
- Kullanıcı profilleri, istatistikler ve yıldızlama
- Çift dil desteği (İngilizce / Türkçe)
- Ayarlanabilir yazı boyutu
- **Alan bazlı hata geri bildirimi** — hatalı input otomatik olarak ekrana gelir, kırmızı flash alır ve altında açıklama gösterir
- Dark tema, minimal ve tutarlı tasarım sistemi

### Teknoloji Yığını

**Frontend**

- React 19 + Vite 8
- React Router v7
- Tailwind CSS v4 (custom design token sistemi)
- Vercel'de yayında — [reporeef.com](https://reporeef.com)

**Backend** ([ayrı repo](https://github.com/eraygdev/reporeef-api))

- Go 1.26 + Gin
- pgx/v5 + Neon PostgreSQL
- GitHub OAuth + JWT
- Docker (multi-stage, non-root)

### Kurulum

```bash
git clone https://github.com/eraygdev/reporeef.git
cd reporeef
npm install
cp .env.example .env  # VITE_API_URL'i ayarla
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.

### Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır — detaylar için [LICENSE](LICENSE) dosyasına bakın.

### İletişim

**Eray** — [@eraygdev](https://github.com/eraygdev)
E-posta: hello@reporeef.com

### Dev Stack

📚 **[Full tech stack →](STACK.md)**
