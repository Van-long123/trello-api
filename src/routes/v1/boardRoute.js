import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
const Router = express.Router()

Router.route('/')
  .get(boardController.getBoards)
  .post(
    multerUploadMiddleware.upload.single('background'),
    boardValidation.createNew,
    boardController.createNew)
Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)

// API hỗ trợ việc di chuyển card giữa các column khác nhau trong một board
Router.route('/supports/moving_card')
  .put(boardValidation.moveCartToDifferentColumn, boardController.moveCartToDifferentColumn)
export const boardRoute = Router