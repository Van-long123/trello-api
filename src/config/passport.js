import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { env } from './environment'

passport.use(new GoogleStrategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/v1/users/google/callback'
  },
  async (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile)
  }
))
