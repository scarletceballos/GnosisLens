import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

export default function(passport) {
  // Local Strategy
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      // Find user by username or email
      const user = await User.findOne({
        $or: [
          { username: username },
          { email: username }
        ]
      });

      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
