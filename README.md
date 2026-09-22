# Collab-Hub

> A platform where developers discover projects, collaborate with teams, and find teammates.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## About

Collab-Hub is an open platform built for **project collaboration** — a place where people
can share what they're working on, join teams, and find teammates for their next idea.

The long-term goal is to add an **AI-powered project analyzer** that reads the README of any
submitted project and automatically suggests relevant categories and tags. The AI model will
be trained from scratch using **PyTorch**, as part of my university coursework.

## Features

### Currently available
- Browse the latest community projects
- Detailed project view with tech stack, author, and stats
- Responsive layout with collapsible sidebar navigation
- Clean, minimal UI (Tailwind CSS)

### In development
- User authentication (login / register)
- Project creation flow
- Dashboard for managing your own projects
- AI-based category suggestions for uploaded projects

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS

**Backend** _(planned)_
- Go — REST API and traffic handling
- Python (PyTorch) — AI model for project categorization

**Infrastructure** _(planned)_
- Docker containers
- Hosting: Vercel + dedicated server

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/eraygdev/web-collab-hub.git
cd web-collab-hub

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

## Roadmap

- [x] Frontend skeleton (Home, ProjectDetail, Navbar, Sidebar, Footer)
- [x] ProjectCard with dynamic category badges
- [ ] Authentication system (login / register)
- [ ] Project creation and editing
- [ ] User dashboard
- [ ] Go REST API backend
- [ ] Docker setup
- [ ] Python + PyTorch AI model (category suggestion)
- [ ] Deployment (Vercel + dedicated server)
- [ ] Custom domain

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## Contact

**Eray** — [@eraygdev](https://github.com/eraygdev)
Email: retadeveloper@gmail.com

---

## 🇹🇷 Türkçe

> Geliştiricilerin projeleri keşfettiği, ekiplerle iş birliği yaptığı ve ekip arkadaşı bulduğu bir platform.

### Hakkında

Collab-Hub, **proje iş birliği** için kurulmuş açık bir platformdur. Kullanıcılar üzerinde
çalıştıkları projeleri paylaşabilir, ekiplere katılabilir ve yeni fikirleri için ekip
arkadaşı bulabilir.

Uzun vadeli hedef, yüklenen her projenin README'sini okuyup **AI ile kategori ve etiket
öneren** bir sistem eklemektir. Bu yapay zeka modeli, üniversite derslerim kapsamında
**PyTorch** ile sıfırdan eğitilecektir.

### Şu an mevcut
- Topluluk projelerini keşfetme
- Teknoloji yığını, yazar ve istatistiklerle detaylı proje görünümü
- Açılır-kapanır kenar menü ile responsive tasarım
- Sade, minimal arayüz (Tailwind CSS)
- 404 sayfası ve sayfa geçişlerinde otomatik yukarı kaydırma

### Geliştirme aşamasında
- Kullanıcı kimlik doğrulama (giriş / kayıt)
- Proje oluşturma akışı
- Kendi projelerini yönettiğin panel (Dashboard)
- Yüklenen projeler için AI destekli kategori önerisi

### Teknoloji Yığını

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS

**Backend** _(planlanıyor)_
- Go — REST API ve trafik yönetimi
- Python (PyTorch) — Proje kategorizasyonu için AI modeli

**Altyapı** _(planlanıyor)_
- Docker konteynerleri
- Hosting: Vercel + kiralık sunucu

### Kurulum

```bash
git clone https://github.com/eraygdev/web-collab-hub.git
cd web-collab-hub
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.

### Yol Haritası

- [x] Frontend iskeleti (Home, ProjectDetail, Navbar, Sidebar, Footer)
- [x] Dinamik kategori etiketli ProjectCard
- [ ] Kimlik doğrulama sistemi
- [ ] Proje oluşturma ve düzenleme
- [ ] Kullanıcı paneli (Dashboard)
- [ ] Go REST API backend
- [ ] Docker kurulumu
- [ ] Python + PyTorch AI modeli (kategori önerisi)
- [ ] Deployment (Vercel + kiralık sunucu)
- [ ] Özel domain

### Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır — detaylar için [LICENSE](LICENSE) dosyasına bakın.

### İletişim

**Eray** — [@eraygdev](https://github.com/eraygdev)
E-posta: retadeveloper@gmail.com
