# **MyOKR - Empowering Goal-Oriented Teams**

A modern Objective and Key Results (OKR) management platform for organizations.

## Table of Contents

- [1. Project Description](#1-project-description)
- [2. Installation Guide](#2-installation-guide)
- [3. Usage Instructions](#3-usage-instructions)
- [4. Configuration & Environment Variables](#4-configuration--environment-variables)
- [5. Features](#5-features)
- [6. API Documentation](#6-api-documentation)
- [7. Technologies Used](#7-technologies-used)
- [8. Contributing Guidelines](#8-contributing-guidelines)
- [9. License](#9-license)
- [10. Acknowledgments & Credits](#10-acknowledgments--credits)

## 1. Project Description

MyOKR is a comprehensive OKR management application built with Next.js, designed to help organizations and teams set, track, and achieve their goals effectively. It provides a user-friendly interface for defining objectives, key results, and monitoring progress. MyOKR is suitable for individuals, teams, and entire organizations looking to implement the OKR methodology for improved performance management and goal alignment. The application addresses the challenges of managing OKRs by providing a centralized platform for tracking progress, fostering collaboration, and generating insightful analytics.
Key highlights include:

- **Intuitive Interface:** Easy-to-use dashboards and forms for managing OKRs.

* **Team Collaboration:** Seamlessly collaborate on objectives and key results.
* **Progress Tracking:** Monitor progress visually with progress bars and charts.
* **Comprehensive Analytics:** Gain insights into team and individual performance.
* **AI-Powered Suggestions (Planned):** Get intelligent recommendations for achieving your OKRs (currently in development).
* **Role-Based Access Control:** Secure and manage access permissions based on user roles.

## 2. Installation Guide

This project uses Next.js and requires Node.js and npm (or yarn, pnpm, bun) to run.

1. **Clone the repository:**

```bash

```

git clone <repository_url>
cd my-okr

```

```

2. **Install dependencies:**

```bash

```

npm install

# or

yarn install

# or

pnpm install

# or

bun install

```

```

3. **Set up environment variables (optional):** Create a `.env` file in the root directory and add any necessary environment variables. See the [Configuration & Environment Variables](#4-configuration--environment-variables) section for details.

## 3. Usage Instructions

To run the development server:

```bash

```

npm run dev

# or

yarn dev

# or

pnpm dev

# or

bun dev

```

```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Configuration & Environment Variables

The project uses environment variables, primarily for database connection and authentication. A `.env` file is not committed to the repository, for security reasons. Example `.env` content:

```

```

MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_nextauth_url (e.g., http://localhost:3000)

```

```

## 5. Features

- **OKR Management:** Create, edit, and delete Objectives and Key Results at the individual, team, department, and organizational levels.

* **Team Management:** Create, edit, and manage teams, including assigning team leads and members.
* **Department Management:** Create, edit, and manage departments, including assigning department heads.
* **User Management:** Add, edit, and manage user accounts, roles, and permissions.
* **Progress Tracking:** Track and visualize progress towards objectives and key results using progress bars and charts.
* **Analytics Dashboard:** Gain insights into overall organization performance and trends.
* **Authentication:** Secure authentication via Google OAuth.
* **Activity Logging:** Track updates and changes to OKRs, teams, and other aspects of the app.

## 6. API Documentation

The application uses several API endpoints for data management. Authentication is handled through NextAuth.js, with access tokens needed for most API routes. All APIs return JSON.
**Base URL:** `/api`
| Endpoint | Method | Description | Request Body (example) | Response (example) |
|----------------------|--------|-------------------------------------------------------|----------------------------------------------------|---------------------------------------------------|
| `/okrs/new` | POST | Create a new OKR | `{ title: "Increase Sales", description: "...", ... }` | `{ success: true, okr: { _id: "...", ... } }` |
| `/okrs` | GET | Get all OKRs (filterable by type) | `{type: "individual"}` | `{ success: true, data: [{ _id: "...", ... }, ...] }` |
| `/okrs/{id}` | GET | Get a specific OKR | | `{ _id: "...", title: "...", ... }` |
| `/okrs/{id}` | PUT | Update a specific OKR | `{ title: "New Title", description: "...", ... }` | `{ _id: "...", title: "...", ... }` |
| `/okrs/{id}` | DELETE | Delete a specific OKR | | `{ message: "OKR deleted successfully" }` |
| `/okrs/{id}/updates` | GET | Get update logs for a specific OKR | | `[{ action: "...", fieldChanged: "...", ... }, ...]` |
| `/teams/new` | POST | Create a new team | `{ name: "Team A", description: "...", ... }` | `{ message: "Team created successfully", team: { _id: "...", ... } }` |
| `/teams` | GET | Get all teams (filterable by departmentId) | `{departmentId: "dept-1"}` | `{ success: true, data: [{ _id: "...", ... }, ...] }` |
| `/teams/{id}` | GET | Get a specific team | | `{ _id: "...", name: "...", ... }` |
| `/teams/{id}` | PUT | Update a specific team | `{ name: "New Team Name", ... }` | `{ _id: "...", name: "...", ... }` |
| `/teams/{id}` | DELETE | Delete a specific team | | `{ message: "Team deleted successfully" }` |
| `/people/new` | POST | Create a new person | `{ name: "New Person", email: "...", ... }` | `{ message: "User created successfully", user: { _id: "...", ... } }` |
| `/people` | GET | Get all people | | `[{ _id: "...", name: "...", ... }, ...]` |
| `/people/{id}` | GET | Get details for a specific person | | `{ _id: "...", name: "...", ... }` |
| `/people/{id}` | PUT | Update details for a specific person | `{ name: "Updated Name", ... }` | `{ _id: "...", name: "...", ... }` |
| `/departments/new` | POST | Create a new department | `{ name: "New Department", description: "...", ... }` | `{ _id: "...", name: "...", ... }` |
| `/departments` | GET | Get all departments | | `[{ _id: "...", name: "...", ... }, ...]` |
| `/departments/{id}` | GET | Get details for a specific department | | `{ _id: "...", name: "...", ... }` |
| `/departments/{id}` | PUT | Update details for a specific department | `{ name: "Updated Department", ... }` | `{ _id: "...", name: "...", ... }` |
| `/departments/{id}` | DELETE | Delete a specific department | | `{ message: "Department deleted successfully" }` |
| `/signin` | POST | Sign in user (used by NextAuth callbacks) | `{ email: "...", ... }` | `{ message: "User created successfully", user: { _id: "...", ... } }` |

## 7. Technologies Used

- **Next.js:** React framework for building the user interface. [https://nextjs.org/](https://nextjs.org/)

* **React:** JavaScript library for building user interfaces. [https://reactjs.org/](https://reactjs.org/)
* **Tailwind CSS:** Utility-first CSS framework. [https://tailwindcss.com/](https://tailwindcss.com/)
* **Radix UI:** Primitive UI component library. [https://radix-ui.com/](https://radix-ui.com/)
* **Lucide:** Icon library. [https://lucide.dev/](https://lucide.dev/)
* **NextAuth.js:** Authentication library. [https://next-auth.js.org/](https://next-auth.js.org/)
* **Mongoose:** MongoDB ODM. [https://mongoosejs.com/](https://mongoosejs.com/)
* **MongoDB:** NoSQL database. [https://www.mongodb.com/](https://www.mongodb.com/)

## 8. Contributing Guidelines

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Clone** your forked repository to your local machine.
3. **Create a new branch** for your feature or bug fix.
4. **Make your changes** and commit them with descriptive messages.
5. **Push** your branch to your forked repository.
6. **Create a pull request** to merge your changes into the main repository.
   We use **Prettier** for code formatting and **ESLint** for linting. Please ensure your code adheres to these style guides before submitting a pull request.

## 9. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 10. Acknowledgments & Credits

This project utilizes several open-source libraries, including those listed in the [Technologies Used](#7-technologies-used) section. Thanks to the creators and contributors of these projects.
