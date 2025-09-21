import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import multer from 'multer'
const upload=multer()

const Router = express.Router()
Router.route('/')
  .post(cardValidation.createNew, cardController.createNew)

Router.route('/:id')
  .put(multerUploadMiddleware.upload.single('cardCover'), cardValidation.update, cardController.update)

Router.route('/attach/:id')
  .put(upload.single('file'), cardController.createAttachInCard)

Router.route('/:id/watch')
  .post(cardController.watchCard)
  .delete(cardController.unwatchCard)
export const cardRoute = Router