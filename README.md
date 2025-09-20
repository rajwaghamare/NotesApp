# 📝 SaaS Notes Application

A **Multi-Tenant SaaS Notes App** built with the **MERN stack** and deployed on **Vercel**.  
Each tenant (company) has isolated notes and users, with role-based access control and subscription feature gating.

---
![WhatsApp Image 2025-09-19 at 16 50 54_5ec97321](https://github.com/user-attachments/assets/d9e2b15b-75d3-4fc1-9e34-4a17d8d5ca79)
![WhatsApp Image 2025-09-19 at 16 47 23_b79373ab](https://github.com/user-attachments/assets/0854a5a8-aa61-4420-9062-05dcb3efd456)

## 🚀 Features

### 🔑 Multi-Tenancy
- Supports multiple tenants (e.g., **Acme** and **Globex**).
- Strict tenant isolation (data from one tenant is never visible to another).
- Implemented using **tenantSlug** with shared schema.

### 👥 Authentication & Authorization
- **JWT-based authentication**.
- Roles:
  - **Admin**: Invite users, upgrade subscription.
  - **Member**: Create, view, edit, delete notes.
- Pre-seeded test accounts:
  - `admin@acme.test` / `password`
  - `user@acme.test` / `password`
  - `admin@globex.test` / `password`
  - `user@globex.test` / `password`


### 🗒 Notes API
| Method | Endpoint       | Description                   |
|--------|---------------|-------------------------------|
| POST   | `/notes`      | Create a note (role restricted) |
| GET    | `/notes`      | List all notes for tenant       |
| GET    | `/notes/:id`  | Retrieve a specific note        |
| PUT    | `/notes/:id`  | Update a note                  |
| DELETE | `/notes/:id`  | Delete a note                  |

### 🖥 Frontend
- Built with **React + Vite + TailwindCSS**.
- Minimal but modern UI with gradient and glassmorphism.
- Features:
- Login using seeded accounts.
- Create / delete notes.
- Shows "Upgrade to Pro" banner when free tenant hits note limit.

---

## ⚡ Tech Stack

- **Frontend** → React, Vite, TailwindCSS  
- **Backend** → Node.js, Express.js  
- **Database** → MongoDB Atlas  
- **Auth** → JWT  
- **Deployment** → Vercel  

---

## 🛠 Setup (Local Development)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/rajwaghamare/NotesApp.git
cd NotesApp

