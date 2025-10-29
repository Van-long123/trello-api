import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'
import multer from 'multer'
const upload=multer()

const Router = express.Router()
Router.route('/')
  .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)

Router.route('/copy')
  .post(authMiddleware.isAuthorized, cardValidation.createNewCopy, cardController.createNewCopy)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, multerUploadMiddleware.upload.single('cardCover'), cardValidation.update, cardController.update)

Router.route('/attach/:id')
  .put(authMiddleware.isAuthorized, upload.single('file'), cardController.createAttachInCard)

Router.route('/:id/watch')
  .post(authMiddleware.isAuthorized, cardController.watchCard)
  .delete(authMiddleware.isAuthorized, cardController.unwatchCard)

Router.route('/:id/share')
  .put(authMiddleware.isAuthorized, cardController.shareCard)
  .post(authMiddleware.isAuthorized, cardController.sendMail)

Router.route('/public/:shareToken')
  .get(cardController.publicCard)
export const cardRoute = Router