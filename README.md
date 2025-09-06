[English](README.md), [Deutsch](README_de_DE.md), [Italiano](README_it_IT.md), [한국인](README_ko_KR.md), [Nederlands](README_nl_NL.md), [简体中文](README_zh_CN.md)

# Feather Press

Feather Press is a lightweight, modern **content publishing platform** that allows you to create and manage blogs, videos, galleries, and quotes with ease.  
It combines simplicity with powerful features like **AI-powered title generation**, responsive design, and a clean interface for both creators and readers.

---

##  What can Feather Press do?

Feather Press makes it possible to host your own publishing platform with minimal fuss.  
You can:

- Write and publish blogs with rich content
- Share videos, galleries, and quotes
- Generate AI-powered titles for your posts
- Manage your content with a friendly dashboard
- Browse posts in an organized feed (blogs, videos, galleries, and more)

Whether you want a personal blog, a multimedia hub, or a collaborative publishing platform, Feather Press adapts to your needs.

---

##  Key Features

### Core
- Simple login and signup system (`admin / admin123` as test credentials, or create your own account)
- Fully responsive frontend built with **Vite + React + TailwindCSS**
- Secure backend powered by **Node.js + Express**
- MySQL database hosted on **Aiven** with SSL support
- Clean user dashboard to manage content
- AI Generate Mode to suggest titles from your summaries
- Deployment-ready for **Netlify (frontend)** and **Render (backend)**

### Content Types
- **Blogs** – Write and publish articles
- **Videos** – Add and view uploaded video content
- **Gallery** – Share image collections
- **Quotes** – Create inspirational or reference quotes
- **Posts** – General publishing area for any content type

---

##  Requirements

- **Node.js 18+** and npm
- **MySQL 5.7+ / 8.0+** (Aiven-hosted recommended)
- SSL certificate for database connection (`aiven-ca.pem`)
- GitHub account connected with Netlify and Render for deployment

---

## ⚙ Installation (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/feather-press.git
cd feather-press
# Feather Press Setup Guide

##  Install Dependencies

### Backend
```bash
cd backend
npm install
cd ../frontend
npm install
  
