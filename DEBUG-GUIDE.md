# Debug Guide for Price Analysis Authentication System

## Issues Found and Fixed

### ✅ Code Issues Fixed:

1. **Passport Configuration**: Fixed passport.js to export a function that takes passport as parameter
2. **Middleware Order**: Moved view engine setup before routes
3. **Duplicate Imports**: Removed duplicate passport require from routes/auth.js

### ❌ Current Issue: npm install not working

The main issue preventing the application from running is that `npm install` is not creating the `node_modules` directory.

## Debugging Steps

### 1. Check npm Configuration
```bash
npm config list
npm config get registry
```

### 2. Try Alternative Package Managers
```bash
# Try yarn instead
yarn install

# Or try npm with different flags
npm install --no-optional
npm install --legacy-peer-deps
```

### 3. Check Node.js and npm Versions
```bash
node --version
npm --version
```

### 4. Clear npm Cache
```bash
npm cache clean --force
```

### 5. Try Manual Installation
```bash
# Install dependencies one by one
npm install express
npm install express-session
npm install passport
npm install passport-local
npm install bcryptjs
npm install mongoose
npm install body-parser
npm install express-flash
npm install connect-mongo
npm install dotenv
npm install express-ejs-layouts
```

### 6. Check File Permissions
Make sure you have write permissions in the project directory.

### 7. Try Different Directory
Create a new directory and try installing there:
```bash
mkdir test-npm
cd test-npm
npm init -y
npm install express
```

## Working Demo

I've created a `simple-server.js` that demonstrates the UI without requiring npm dependencies. You can run it with:

```bash
node simple-server.js
```

Then visit `http://localhost:3000` to see the registration and login pages.

## Full Solution Steps

1. **Fix npm issue** using the debugging steps above
2. **Install dependencies**: `npm install`
3. **Start MongoDB** (local or Atlas)
4. **Run the application**: `node server.js`

## Alternative Solutions

### Option 1: Use Yarn
```bash
yarn install
yarn start
```

### Option 2: Use pnpm
```bash
npm install -g pnpm
pnpm install
pnpm start
```

### Option 3: Manual Dependency Installation
If npm continues to fail, you can manually download and install the dependencies.

## File Structure Status

✅ **Working Files:**
- `server.js` - Main Express server (fixed)
- `config/passport.js` - Passport configuration (fixed)
- `routes/auth.js` - Authentication routes (fixed)
- `models/User.js` - User model
- `views/` - EJS templates
- `simple-server.js` - Demo server (working)

❌ **Issue:**
- `node_modules/` - Missing (npm install not working)

## Next Steps

1. Try the debugging steps above
2. If npm still doesn't work, use yarn or pnpm
3. Once dependencies are installed, run `node server.js`
4. The application will be available at `http://localhost:3000`

## Testing the Application

Once dependencies are installed:

1. **Start MongoDB**
2. **Run**: `node server.js`
3. **Visit**: `http://localhost:3000`
4. **Test Registration**: Go to `/register`
5. **Test Login**: Go to `/login`
6. **Test Dashboard**: Login and go to `/dashboard`

The application includes:
- Beautiful, responsive UI
- Form validation
- Password hashing
- Session management
- Protected routes
- Flash messages

