<div align="center">

# 📝 Blogora — A Modern Full-Stack Blogging Platform

### Built during my Full Stack Developer Internship at [Certura](https://certura.com)

[![Live Demo](https://img.shields.io/badge/Live_Demo-blogorablogs.vercel.app-4F46E5?style=for-the-badge)](https://blogorablogs.vercel.app/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-00D084?style=for-the-badge)](#-tech-stack)
[![Internship](https://img.shields.io/badge/Internship-Certura-FF6B35?style=for-the-badge)](#-internship-context)

**Blogora** is a comprehensive, feature-rich blogging platform built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It empowers users to express their thoughts, connect with others, and build a vibrant writing community with full social networking features.

[Live Demo](https://blogorablogs.vercel.app/) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started)

</div>

---

## 🏢 Internship Context

This project was designed and developed during my **Full Stack Developer (MERN Stack) internship** at **[Certura](https://certura.com)** (July 2025 – August 2025). It served as the primary internship deliverable demonstrating end-to-end full-stack development capabilities.

**Internship objectives covered:**
- Design and build a production-ready full-stack application from scratch
- Implement secure JWT-based authentication with password recovery
- Build a social networking layer (follow system, likes, nested comments)
- Integrate third-party services (Cloudinary for media, Nodemailer for emails)
- Apply MVC architecture with proper separation of concerns
- Deploy frontend and backend independently (Vercel + Render)

---

## ✨ Features

### 📝 Blog Management
| Feature | Description |
|---------|-------------|
| **Create, Edit & Delete** | Full CRUD operations with rich text editor (TipTap + React Quill) |
| **Image Upload** | Cloudinary integration for seamless image hosting and optimization |
| **Tags System** | Organize posts with customizable tags for better discoverability |
| **Search** | Find posts quickly using keyword-based search |
| **Top Posts** | Discover trending content based on engagement metrics |

### 👥 Social Features
| Feature | Description |
|---------|-------------|
| **User Profiles** | Customizable profiles with bio, about section, and profile pictures |
| **Follow System** | Follow/unfollow other users to stay updated with their content |
| **Comments & Replies** | Nested comment threads with full reply functionality |
| **Like System** | Like posts and comments to show appreciation |
| **Author Profiles** | View detailed author profiles with posts, followers, and bio |

### 🔒 Security & Authentication
| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure token-based auth for all protected routes |
| **Password Reset** | Email-based password recovery with secure tokens (Nodemailer) |
| **Protected Routes** | Client and server-side route protection |
| **Password Encryption** | Bcrypt hashing for secure password storage |

### 🎨 User Experience
| Feature | Description |
|---------|-------------|
| **Responsive Design** | Fully optimized for desktops, tablets, and mobile devices |
| **Modern UI** | Material-UI + Tailwind CSS + Framer Motion animations |
| **Rich Text Editor** | TipTap and React Quill for enhanced content creation |
| **Toast Notifications** | Real-time feedback for all user actions |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Server-side JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **Bcrypt** | Password hashing |
| **Cloudinary** | Image storage and CDN |
| **Multer** | File upload handling |
| **Nodemailer** | Email service (password reset) |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **React Router DOM** | Client-side routing |
| **Material-UI (MUI)** | Component library |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Animation library |
| **TipTap & React Quill** | Rich text editors |
| **Axios** | HTTP client |
| **React Toastify** | Toast notifications |

### Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend API hosting |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Image CDN |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           FRONTEND (Vercel)                     │
│      React 18 + Vite + Tailwind CSS            │
│     + MUI + Framer Motion + TipTap             │
│                                                 │
│  ┌─────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Blog   │  │  Social  │  │   Auth &     │   │
│  │ Editor  │  │  Feed    │  │  Profiles    │   │
│  └────┬────┘  └────┬─────┘  └──────┬───────┘   │
├───────┼────────────┼───────────────┼────────────┤
│                 REST API                        │
├───────┼────────────┼───────────────┼────────────┤
│           BACKEND (Render)                      │
│        Node.js + Express.js                     │
│                                                 │
│  ┌─────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Posts   │  │ Users    │  │   Mail       │   │
│  │Controller│ │Controller│  │ Controller   │   │
│  └────┬────┘  └────┬─────┘  └──────┬───────┘   │
│       └────────────┼───────────────┘            │
│            ┌───────┴───────┐                    │
│            │ MongoDB Atlas │                    │
│            └───────────────┘                    │
│  ┌──────────────┐  ┌─────────────────────┐      │
│  │  Cloudinary  │  │   Nodemailer        │      │
│  │  (Images)    │  │   (Emails)          │      │
│  └──────────────┘  └─────────────────────┘      │
└─────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Bloging-website/
├── backend/                    # Express.js API Server
│   ├── config/                # Configuration files
│   │   └── mailConfig.js      # Email service configuration
│   ├── controllers/           # Route controllers (MVC)
│   │   ├── mailController.js  # Password reset email handling
│   │   ├── mainController.js  # Main application logic
│   │   ├── postsController.js # Post CRUD operations
│   │   └── userController.js  # User management & auth
│   ├── db/                    # Database connection setup
│   ├── models/                # Mongoose schemas
│   │   ├── postModel.js       # Post schema
│   │   ├── userModel.js       # User schema
│   │   └── resetPassModel.js  # Password reset token schema
│   ├── routes/                # API route definitions
│   │   ├── mainRouter.js      # Main routes
│   │   ├── postsRouter.js     # Post CRUD routes
│   │   └── userRouter.js      # User & auth routes
│   ├── utils/                 # Utility functions
│   │   ├── cloudinary.js      # Cloudinary config
│   │   ├── token.js           # JWT token utilities
│   │   └── upload.js          # Multer upload config
│   ├── server.js              # Express entry point
│   └── package.json
│
├── frontend/                  # React SPA
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images, fonts
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route page components
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** database (or [MongoDB Atlas](https://www.mongodb.com/atlas) account)
- **Cloudinary** account for image uploads

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Start the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the app:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 👨‍💻 Developer

**Muhammad Sheraz**
Full Stack Developer (MERN Stack)

🌐 [Portfolio](https://sherazportfolio.vercel.app) · 💼 [LinkedIn](https://linkedin.com/in/muhammad-sheraz-800948347) · 🏢 Internship at [Certura](https://certura.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
