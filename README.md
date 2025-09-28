# GnosisLens - Oracle of Wisdom

A fullstack travel scam detection app with AI-powered analysis and user analytics.

## Features

- 🔮 **Oracle of Wisdom**: AI-powered scam detection using Gemini API
- 👤 **User Authentication**: Secure login/register with Passport.js
- 📊 **Analytics Dashboard**: Track your travel purchases and scam patterns
- 🌍 **Multi-currency Support**: Real-time exchange rates and currency conversion
- 🏛️ **Goddess Personalities**: Three unique AI personalities (Dike, Apate, Nemesis)

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Passport.js for authentication
- Gemini AI API for scam analysis

### Frontend
- Next.js 15 with React
- TypeScript
- Tailwind CSS
- Framer Motion for animations

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Gemini API key

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd GirlHacks
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
npm install
```

#### Frontend Dependencies
```bash
cd GnosisLens/gnosislens-frontend
npm install
cd ../..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/gnosislens
SESSION_SECRET=your-super-secret-session-key-here
GEMINI_API_KEY=your-gemini-api-key-here
PORT=8000
```

### 4. Database Setup

Make sure MongoDB is running locally or update `MONGODB_URI` in `.env` to point to your MongoDB instance.

### 5. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

## Running the Application

### Start the Backend Server
```bash
# From the root directory
npm run dev
# or
node server-with-auth.mjs
```

The backend will start on `http://localhost:8000`

### Start the Frontend Development Server
```bash
# From the frontend directory
cd GnosisLens/gnosislens-frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

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
GirlHacks/
├── config/
│   └── passport.js          # Passport authentication config
├── lib/
│   ├── database.js          # Database utilities
│   └── goddess_chatbot.js   # AI analysis logic
├── models/
│   └── User.js              # User model
├── routes/
│   └── auth.js              # Authentication routes
├── GnosisLens/
│   └── gnosislens-frontend/ # Next.js frontend
│       ├── src/
│       │   ├── app/         # App router pages
│       │   └── components/  # React components
│       └── public/          # Static assets
├── server-with-auth.mjs     # Main backend server
└── package.json             # Backend dependencies
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

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
