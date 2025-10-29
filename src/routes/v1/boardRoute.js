import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getBoards)
  .post(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('background'),
    boardValidation.createNew,
    boardController.createNew)

Router.route('/full')
  .get(authMiddleware.isAuthorized, boardController.getFullBoards)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, boardValidation.update, boardController.update)

Router.route('/:id/share')
  .get(boardController.getShare)
// API hỗ trợ việc di chuyển card giữa các column khác nhau trong một board
Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorized, boardValidation.moveCartToDifferentColumn, boardController.moveCartToDifferentColumn)
export const boardRoute = Router