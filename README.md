# 📝 Blogora - A Modern Full-Stack Blogging Platform

**Blogora** is a comprehensive, feature-rich blogging platform built using the MERN stack (MongoDB, Express.js, React, Node.js). Designed during an internship at **Certura**, Blogora empowers users to express their thoughts, connect with others, and build a vibrant writing community with social networking features.

---

## 🚀 Live Demo

🌐 **[Visit Blogora](https://blogorablogs.vercel.app/)**

---

## ✨ Features

### 📝 Blog Management
- **Create, Edit, and Delete Posts:** Full CRUD operations for blog posts with rich text editor
- **Image Upload:** Cloudinary integration for seamless image hosting and optimization
- **Tags System:** Organize posts with customizable tags for better discoverability
- **Search Functionality:** Find posts quickly using keyword search

### 👥 Social Features
- **User Authentication:** Secure JWT-based registration and login system
- **User Profiles:** Customizable profiles with bio, about section, and profile pictures
- **Follow System:** Follow/unfollow other users to stay updated with their content
- **Comments & Replies:** Engage with posts through nested comments and replies
- **Like System:** Like posts and comments to show appreciation

### 💬 Engagement
- **Real-time Interactions:** Dynamic comment threads with reply functionality
- **Author Profiles:** View detailed author profiles with their posts, followers, and bio
- **Top Posts:** Discover trending content based on engagement

### 🎨 User Experience
- **Responsive Design:** Fully optimized for desktops, tablets, and mobile devices
- **Modern UI:** Built with React, Material-UI, Tailwind CSS, and Framer Motion
- **Rich Text Editor:** TipTap and React Quill integration for enhanced content creation
- **Toast Notifications:** Real-time feedback for user actions

### 🔒 Security & Authentication
- **Password Reset:** Email-based password recovery system with secure tokens
- **JWT Authentication:** Secure token-based authentication
- **Protected Routes:** Client and server-side route protection
- **Password Encryption:** Bcrypt hashing for secure password storage

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js** - Server-side framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage and optimization
- **Multer** - File upload handling
- **Nodemailer** - Email service for password reset
- **CORS** - Cross-origin resource sharing
- **Day.js** - Date formatting utilities

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TipTap & React Quill** - Rich text editors
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **js-cookie** - Cookie management
- **Lucide React & React Icons** - Icon libraries
- **Date-fns & Moment.js** - Date manipulation

---

## 📁 Project Structure

```
Bloging-website/
├── backend/                    # Backend server
│   ├── config/                # Configuration files
│   │   └── mailConfig.js      # Email service configuration
│   ├── controllers/           # Route controllers
│   │   ├── mailController.js  # Email handling
│   │   ├── mainController.js  # Main application logic
│   │   ├── postsController.js # Post CRUD operations
│   │   └── userController.js  # User management
│   ├── db/                    # Database connection
│   ├── models/                # Mongoose schemas
│   │   ├── postModel.js       # Post schema
│   │   ├── userModel.js       # User schema
│   │   └── resetPassModel.js  # Password reset token schema
│   ├── routes/                # API routes
│   │   ├── mainRouter.js      # Main routes
│   │   ├── postsRouter.js     # Post routes
│   │   └── userRouter.js      # User routes
│   ├── utils/                 # Utility functions
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   ├── formaters.js       # Data formatters
│   │   ├── token.js           # JWT token utilities
│   │   └── upload.js          # Multer upload configuration
│   ├── server.js              # Express server entry point
│   └── package.json           # Backend dependencies
│
├── frontend/                  # React frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── components/       # Reusable components
│   │   │   ├── AboutApp.jsx
│   │   │   ├── AuthorProfile.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   ├── EditProfileModel.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HomePosts.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchModel.jsx
│   │   │   └── UploadPostModal.jsx
│   │   ├── contexts/         # React contexts
│   │   │   ├── AuthContext   # Authentication state
│   │   │   └── PostContext   # Posts state
│   │   ├── pages/            # Page components
│   │   │   ├── About.jsx
│   │   │   ├── AllPosts.jsx
│   │   │   ├── AuthorPosts.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Friends.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ResetPass.jsx
│   │   │   ├── SearchedPosts.jsx
│   │   │   ├── SinglePost.jsx
│   │   │   └── Top.jsx
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   ├── vercel.json           # Vercel deployment config
│   └── package.json          # Frontend dependencies
│
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## 🚦 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Cloudinary Account** - [Sign up](https://cloudinary.com/) for image hosting
- **npm** or **bun** - Package manager

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/muhammadsherazsandila/Bloging-website.git
cd Bloging-website
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
# or
bun install

# Create .env file
touch .env
```

**Backend Environment Variables (.env):**
```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM=your_email@gmail.com

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:5173
```

```bash
# Start the backend server
npm start
# or
bun start
```

The backend server will run on `http://localhost:5000`

#### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
bun install

# Create .env file
touch .env
```

**Frontend Environment Variables (.env):**
```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

```bash
# Start the development server
npm run dev
# or
bun dev
```

The frontend will run on `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication & User Routes (`/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/signup` | Register new user | ❌ |
| POST | `/user/login` | User login | ❌ |
| GET | `/user/dashboard` | Get user dashboard | ✅ |
| PUT | `/user/update-profile` | Update user profile | ✅ |
| PUT | `/user/upload-profile-picture` | Upload profile picture | ✅ |
| DELETE | `/user/delete-profile` | Delete user account | ✅ |
| PUT | `/user/follow/:id` | Follow/unfollow user | ✅ |
| GET | `/user/:id` | Get user by ID | ❌ |
| GET | `/user/posts/:id` | Get all posts by user | ❌ |
| POST | `/user/forgot-password` | Request password reset | ❌ |
| POST | `/user/reset-password/:token` | Reset password | ❌ |
| POST | `/user/verify-token` | Verify reset token | ❌ |

### Post Routes (`/post`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/post/` | Get all posts | ❌ |
| GET | `/post/get-post/:id` | Get single post | ❌ |
| POST | `/post/upload-post` | Create new post | ✅ |
| PUT | `/post/update-post/:id` | Update post | ✅ |
| DELETE | `/post/delete-post/:id` | Delete post | ✅ |
| POST | `/post/add-comment/:id` | Add comment to post | ✅ |
| DELETE | `/post/delete-comment/:id` | Delete comment | ✅ |
| PUT | `/post/like-comment/:id` | Like/unlike comment | ✅ |
| POST | `/post/like/:id` | Like/unlike post | ✅ |
| PUT | `/post/follow/:id` | Follow post author | ✅ |

---

## 🎯 Key Features Implementation

### User Authentication Flow
1. Users can sign up with name, email, and password
2. Passwords are hashed using bcrypt before storage
3. Login returns a JWT token stored in cookies
4. Protected routes verify JWT tokens on each request

### Post Management
1. Users can create posts with images uploaded to Cloudinary
2. Posts support rich text content and tags
3. Authors can edit or delete their own posts
4. All users can view and search posts

### Social Interactions
1. Users can follow/unfollow other users
2. Followers and following counts are tracked
3. Posts can be liked by authenticated users
4. Comments support nested replies
5. Comments can also be liked

### Password Reset
1. Users request password reset via email
2. Secure token is generated and emailed
3. Token expires after a set time period
4. Users reset password using the token link

---

## 🚀 Deployment

### Backend Deployment (Vercel/Heroku/Railway)

**Vercel:**
```bash
cd backend
vercel deploy
```

**Environment Variables:** Set all backend `.env` variables in your deployment platform's settings.

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel deploy
```

**Important:** Update `VITE_API_URL` environment variable to point to your deployed backend URL.

### Database (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Add it to your backend environment variables
4. Whitelist your deployment IP addresses

---

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

**Backend:**
```bash
cd backend
npm run build  # If build script exists
```

**Frontend:**
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

### Linting

**Frontend:**
```bash
cd frontend
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Write clear commit messages
- Test your changes before submitting
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Muhammad Sheraz Sandila**
- GitHub: [@muhammadsherazsandila](https://github.com/muhammadsherazsandila)
- LinkedIn: [Muhammad Sheraz Sandila](https://www.linkedin.com/in/muhammad-sheraz-sandila/)

---

## 🙏 Acknowledgments

- Built during internship at **Certura**
- Inspired by modern blogging platforms
- Special thanks to the open-source community

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub Issues](https://github.com/muhammadsherazsandila/Bloging-website/issues)
- Contact the developer through GitHub

---

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Direct messaging between users
- [ ] Advanced search filters
- [ ] Post categories
- [ ] Bookmarking/saving posts
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Analytics dashboard
- [ ] Email notifications for new followers/comments
- [ ] Social media sharing integration

---

**Made with ❤️ by Muhammad Sheraz Sandila**



