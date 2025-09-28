# GnosisLens - Oracle of Wisdom

A fullstack travel scam detection app with AI-powered analysis and user analytics. Get instant feedback on your travel purchases from ancient Greek goddesses who help you avoid tourist traps and find fair deals.

## Features

- 🔮 **Oracle of Wisdom**: AI-powered scam detection using Gemini API
- 👤 **User Authentication**: Secure login/register with Passport.js
- 📊 **Analytics Dashboard**: Track your travel purchases and scam patterns
- 🌍 **Multi-currency Support**: Real-time exchange rates and currency conversion
- 🏛️ **Goddess Personalities**: Three unique AI personalities (Dike, Apate, Nemesis)
- 🎭 **Dynamic Avatars**: Goddess avatars change based on analysis results
- 💰 **Real-time Exchange Rates**: Live currency conversion for accurate pricing

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Passport.js for authentication
- Gemini AI API for scam analysis
- Real-time exchange rate API integration

### Frontend
- Next.js 15 with React
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Auto-animate for smooth transitions

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud) - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Gemini API key** - [Get from Google AI Studio](https://aistudio.google.com/app/apikey)

## Quick Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd GnosisLens-fresh
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

#### Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` with your configuration:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/gnosislens

# Session Secret (change this in production)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Gemini API Key (get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key-here

# Server Port
PORT=8000
```

### 4. Database Setup

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. The app will create the database automatically

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### 5. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## Running the Application

### Start the Backend Server
```bash
# From the backend directory
cd backend
npm run dev
```

The backend will start on `http://localhost:8000`

### Start the Frontend Development Server
```bash
# From the frontend directory (in a new terminal)
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Access the Application
Open your browser and go to `http://localhost:3000`

## Usage

1. **Register/Login**: Create an account or log in to access the Oracle
2. **Ask the Oracle**: Describe your travel purchases to get AI-powered scam analysis
3. **View Analytics**: Check your analytics dashboard for purchase patterns and scam insights
4. **Track Progress**: Monitor your scam risk level and fair deal percentage

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Scam Detection
- `POST /api/scam-check` - Analyze purchase for scams (requires authentication)

### Analytics
- `GET /api/user/analytics` - Get user analytics (requires authentication)
- `GET /api/user/history` - Get purchase history (requires authentication)

## Project Structure

```
GnosisLens-fresh/
├── backend/                 # Node.js/Express backend
│   ├── config/
│   │   └── passport.js      # Passport authentication config
│   ├── lib/
│   │   ├── database.js      # Database utilities
│   │   └── goddess_chatbot.js # AI analysis logic
│   ├── models/
│   │   └── User.js          # User model
│   ├── routes/
│   │   └── auth.js          # Authentication routes
│   ├── server-with-auth.mjs # Main backend server
│   ├── package.json         # Backend dependencies
│   └── env.example          # Environment variables template
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   └── components/      # React components
│   ├── public/
│   │   └── images/          # Goddess avatars and assets
│   ├── package.json         # Frontend dependencies
│   └── next.config.ts       # Next.js configuration
└── README.md                # This file
```

## Development

### Backend Development
- The server uses nodemon for auto-restart during development
- MongoDB connection is handled automatically
- Session management with express-session

### Frontend Development
- Next.js with Turbopack for fast development
- TypeScript for type safety
- Tailwind CSS for styling

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

### Quick Start for Contributors
1. Fork the repository
2. Clone your fork
3. Follow the setup instructions above
4. Create a feature branch
5. Make your changes
6. Test thoroughly
7. Submit a pull request

### Development Areas
- **AI Enhancement**: Improve scam detection algorithms
- **UI/UX**: Enhance the user interface and experience
- **New Features**: Add new goddess personalities or features
- **Mobile**: Develop mobile app version
- **Analytics**: Improve analytics and reporting

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check if MongoDB is running
- Verify your `backend/.env` file has correct values
- Ensure GEMINI_API_KEY is valid

**Frontend won't start:**
- Make sure you're in the `frontend` directory
- Check if all dependencies are installed
- Verify Node.js version (v18+)

**Database connection issues:**
- Check MongoDB connection string in `backend/.env`
- Ensure MongoDB service is running
- For Atlas, check network access settings

**API errors:**
- Verify Gemini API key is correct
- Check API quota and limits
- Review server logs for detailed error messages

## Support

For issues or questions:
- 📧 Open an issue on GitHub
- 💬 Join our community discussions
- 📖 Check the [Contributing Guide](CONTRIBUTING.md)

## Acknowledgments

- Built with ❤️ for travelers worldwide
- Powered by Google Gemini AI
- Inspired by ancient Greek mythology
