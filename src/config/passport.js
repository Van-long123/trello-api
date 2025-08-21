import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { env } from './environment'
import { API_ROOT } from '~/utils/constants'

passport.use(new GoogleStrategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${API_ROOT}/v1/users/google/callback`
  },
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile)
  }
))


passport.use(new FacebookStrategy(
  {
    clientID: env.FACEBOOK_CLIENT_ID,
    clientSecret: env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${API_ROOT}/v1/users/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email', 'name']
  },
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile)
  }
))
