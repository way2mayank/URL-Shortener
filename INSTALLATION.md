# Installation & Setup Guide

## Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git** (optional)

### Step 1: Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud):**
Replace `MONGODB_URI` with:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortener?retryWrites=true&w=majority
```

Start the backend:
```bash
npm run dev
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
📡 API available at http://localhost:5000/api
```

### Step 2: Setup Frontend

In a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Step 3: Test the Application

1. Go to `http://localhost:3000`
2. Click "Sign Up" and create an account
3. Enter a URL and create a short link
4. View analytics and download QR codes

## MongoDB Setup Options

### Option 1: Local MongoDB
```bash
# Windows
mongod

# macOS (if installed via brew)
brew services start mongodb-community
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `MONGODB_URI` in `.env`

## Running Both Servers Together

From the root directory:
```bash
npm run dev
```

Or run separately:
```bash
npm run backend    # Terminal 1
npm run frontend   # Terminal 2
```

## API Testing

Use **Postman** or **Insomnia** to test API endpoints:

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Shorten URL (Requires Auth Token)
```
POST /api/urls/shorten
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very/long/url",
  "customSlug": "myurl",
  "description": "My shortened link",
  "tags": ["important", "link"]
}
```

## Environment Variables Explained

### Backend
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS and QR codes

### Frontend
- `REACT_APP_API_URL` - Backend API URL

## Project Structure

```
mern-url-shortener/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & validation
│   ├── .env            # Environment variables
│   └── server.js       # Express app
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   ├── services/    # API calls
│   │   └── App.jsx      # Main app
│   ├── public/
│   ├── .env
│   └── package.json
├── README.md
└── package.json
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas: verify IP whitelist includes your machine

### Port Already in Use
```bash
# Find process on port 5000 (Windows)
netstat -ano | findstr :5000

# Kill process (Linux/macOS)
lsof -ti:5000 | xargs kill -9
```

### CORS Error
- Check `CLIENT_URL` in backend `.env`
- Ensure it matches frontend URL

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance Tips

1. **Database Indexes** - Already configured for `shortCode` and `userId`
2. **JWT Expiration** - Tokens expire after 30 days
3. **Password Security** - Bcrypt with 10 salt rounds
4. **Rate Limiting** - Consider adding in production

## Production Deployment

Before deploying:
1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use production MongoDB Atlas cluster
4. Enable HTTPS
5. Add environment-specific `.env` files

## Security Checklist

- [ ] Change `JWT_SECRET` in `.env`
- [ ] Use environment variables for sensitive data
- [ ] Set `NODE_ENV=production` on production
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use HTTPS for MongoDB Atlas

## Support

For issues or questions, check:
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)

---

**Happy URL Shortening!** 🚀
