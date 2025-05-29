# **MyOKR - Empowering Goal-Oriented Teams**

A modern Objective and Key Results (OKR) management platform for organizations.

## Table of Contents

* [1. Project Description](#1-project-description)
* [2. Installation Guide](#2-installation-guide)
* [3. Usage Instructions](#3-usage-instructions)
* [4. Configuration & Environment Variables](#4-configuration--environment-variables)
* [5. Features](#5-features)
* [6. API Documentation](#6-api-documentation)
* [7. Technologies Used](#7-technologies-used)
* [8. Contributing Guidelines](#8-contributing-guidelines)
* [9. License](#9-license)
* [10. Acknowledgments & Credits](#10-acknowledgments--credits)

---

## 1. Project Description

**MyOKR** is a comprehensive OKR management application built with **Next.js**, designed to help organizations and teams set, track, and achieve their goals effectively. It provides a user-friendly interface for defining objectives, key results, and monitoring progress.

Key Highlights:

* 🔥 **Intuitive Interface**: Easy-to-use dashboards and forms for managing OKRs.
* 👥 **Team Collaboration**: Collaborate seamlessly on goals and results.
* 📊 **Progress Tracking**: Visualize OKRs using progress bars and charts.
* 📈 **Comprehensive Analytics**: Gain insight into team and individual performance.
* 🧠 **AI Suggestions** (Coming Soon): Smart recommendations for goal completion.
* 🔐 **Role-Based Access Control**: Secure access control by user role.

---

## 2. Installation Guide

> This project uses **Next.js** and requires **Node.js** and a package manager like npm, yarn, pnpm, or bun.

### 1. Clone the repository:

```bash
git clone https://github.com/Sasank-V/My-OKR.git
cd My-OKR
```

### 2. Install dependencies:

```bash
# Choose one
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

---

## 3. Usage Instructions

Start the development server:

```bash
# Choose one
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Configuration & Environment Variables

Create a `.env` file in the root directory with the following:

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 5. Features

* ✅ **OKR Management**: CRUD for Objectives and Key Results at every level.
* 🏢 **Org Hierarchy**: Organization → Departments → Teams → Users.
* 👤 **User Management**: Add/edit roles, teams, and departments.
* 🕵️‍♂️ **Role-Based Access**: Permissions for Admin, Manager, and Users.
* 📊 **Progress Visualization**: View OKR status with dynamic UI.
* 🔐 **Authentication**: Google OAuth via NextAuth.js.
* 📜 **Activity Logging**: Changes to OKRs are logged for transparency.

---

## 6. API Documentation

**Base URL:** `/api`

| Endpoint             | Method | Description                   |
| -------------------- | ------ | ----------------------------- |
| `/okrs/new`          | POST   | Create a new OKR              |
| `/okrs`              | GET    | Get all OKRs                  |
| `/okrs/{id}`         | GET    | Get a specific OKR            |
| `/okrs/{id}`         | PUT    | Update an OKR                 |
| `/okrs/{id}`         | DELETE | Delete an OKR                 |
| `/okrs/{id}/updates` | GET    | Get OKR update logs           |
| `/teams/new`         | POST   | Create a new team             |
| `/teams`             | GET    | Get all teams                 |
| `/teams/{id}`        | GET    | Get a team                    |
| `/teams/{id}`        | PUT    | Update a team                 |
| `/teams/{id}`        | DELETE | Delete a team                 |
| `/people/new`        | POST   | Create a user                 |
| `/people`            | GET    | Get all users                 |
| `/people/{id}`       | GET    | Get a specific user           |
| `/people/{id}`       | PUT    | Update a user                 |
| `/departments/new`   | POST   | Create a department           |
| `/departments`       | GET    | Get all departments           |
| `/departments/{id}`  | GET    | Get a department              |
| `/departments/{id}`  | PUT    | Update a department           |
| `/departments/{id}`  | DELETE | Delete a department           |
| `/signin`            | POST   | Used by NextAuth.js for login |

All API routes return JSON and require authentication.

---

## 7. Technologies Used

* ⚛️ [Next.js](https://nextjs.org/)
* 💅 [Tailwind CSS](https://tailwindcss.com/)
* 🧱 [Radix UI](https://www.radix-ui.com/)
* 🎨 [Lucide Icons](https://lucide.dev/)
* 🔐 [NextAuth.js](https://next-auth.js.org/)
* 🧬 [Mongoose](https://mongoosejs.com/)
* 📦 [MongoDB](https://www.mongodb.com/)

---

## 8. Contributing Guidelines

We welcome contributions! To contribute:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit with a clear message.
5. Push to your fork.
6. Create a Pull Request.

> Ensure your code passes ESLint rules and is formatted with Prettier.

---

## 9. License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for full details.

---

## 10. Acknowledgments & Credits

This project leverages several amazing open-source tools.
Thanks to all contributors of:

* Next.js
* Tailwind CSS
* Radix UI
* Lucide Icons
* NextAuth.js
* Mongoose
* MongoDB
