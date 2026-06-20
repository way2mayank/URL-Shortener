# MERN URL Shortener

A full-stack web application for shortening URLs with user authentication, analytics, and QR code generation. Built with MongoDB, Express.js, React, and Node.js.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **URL Shortening**: Create custom short URLs with optional custom slugs
- **Analytics**: Track clicks and view statistics for each shortened URL
- **QR Codes**: Automatic QR code generation for shortened URLs
- **User Dashboard**: Manage all your shortened URLs in one place
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Input Validation**: Robust validation on both client and server
- **Error Handling**: Comprehensive error messages and handling

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **QRCode** - QR code generation
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Toastify** - Notifications
- **React QR Code** - QR code display

## 🚀 Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- MongoDB (local installation or Atlas cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-url-shortener
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**

   **Backend** - Create `backend/.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

   **Frontend** - Create `frontend/.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run backend

   # Terminal 2 - Frontend
   npm run frontend
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### URLs
- `POST /api/urls/shorten` - Create shortened URL
- `GET /api/urls` - Get all URLs for logged-in user
- `GET /api/urls/:id` - Get specific URL details
- `PUT /api/urls/:id` - Update URL details
- `DELETE /api/urls/:id` - Delete shortened URL
- `GET /:shortCode` - Redirect to original URL

### Analytics
- `GET /api/analytics/:urlId` - Get analytics for a URL
- `GET /api/analytics` - Get all analytics for user's URLs

## 📁 Project Structure

```
mern-url-shortener/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Url.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── urls.js
│   │   └── analytics.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── urlController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── UrlForm.jsx
│   │   │   ├── UrlList.jsx
│   │   │   └── QRCode.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── public/
│
├── .github/
│   └── copilot-instructions.md
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT token-based authentication
- Protected API routes with middleware
- CORS configuration for origin validation
- Input validation and sanitization
- Environment variables for sensitive data

## 💡 Usage Examples

### Create a Shortened URL
```bash
curl -X POST http://localhost:5000/api/urls/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "originalUrl": "https://www.example.com/very/long/url",
    "customSlug": "myurl"
  }'
```

### Redirect using shortened URL
```bash
curl -L http://localhost:5000/myurl
```

## 🧪 Testing

Test the API using:
- **Postman** - Import API collection
- **cURL** - Command line requests
- **Insomnia** - REST client

## 📈 Future Enhancements

- [ ] User email verification
- [ ] Social login (Google, GitHub)
- [ ] Bulk URL shortening
- [ ] URL expiration dates
- [ ] Advanced analytics with charts
- [ ] API key generation for programmatic access
- [ ] Rate limiting
- [ ] Link preview feature
- [ ] Custom domain support
- [ ] Dark mode

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy URL Shortening! 🚀**
