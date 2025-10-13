import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
const Router = express.Router()
Router.route('/')
  .post(columnValidation.createNew, columnController.createNew)

Router.route('/copy')
  .post(columnValidation.createNewCopy, columnController.createNewCopy)

Router.route('/move/:id')
  .put(columnController.moveColumn)

Router.route('/:id')
  .put(columnValidation.update, columnController.update)
  .delete(columnValidation.deleteItem, columnController.deleteItem)

Router.route('/:id/watch')
  .post(columnController.watchColumn)
  .delete(columnController.unwatchColumn)

export const columnRoute = Router