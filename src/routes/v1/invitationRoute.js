import express from 'express'
import { invitationValidation } from '~/validations/invitationValidation'
import { invitationController } from '~/controllers/invitationController'

const Router = express()

Router.route('/board')
  .post(
    invitationValidation.createNewBoardInvitation,
    invitationController.createNewBoardInvitation
  )
Router.route('/')
  .get(invitationController.getInvitations)

Router.route('/board/:notificationId')
  .put(invitationController.updateBoardInvitation)

export const invitationRoute = Router
