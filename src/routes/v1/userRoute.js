import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import passport from 'passport'

const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)
Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .get(userController.refreshToken)

Router.route('/update')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('avatar'),
    userValidation.update,
    userController.update
  )

// Login with google
Router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
Router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, profile) => {
    req.user=profile
    next()
  })(req, res, next)
}, userController.socialAuthCallback)

Router.route('/verify-oauth')
  .post(userController.verifyOAuth)

// Login with facebook
Router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))
Router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (err, profile) => {
    req.user=profile
    next()
  })(req, res, next)
}, userController.socialAuthCallback)

export const userRoute = Router
