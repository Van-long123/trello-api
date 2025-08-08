import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'

const createNewBoardInvitation = async (req, res, next) => {
  try {
    // User thực hiện request này chính là Inviter người đi mời
    const inviterId = req.jwtDecoded._id
    const resInvitation = await invitationService.createNewBoardInvitation(req.body, inviterId)
    return res.status(StatusCodes.CREATED).json(resInvitation)
  } catch (error) {
    next(error)
  }
}

const getInvitations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const resInvitation = await invitationService.getInvitations(userId)
    return res.status(StatusCodes.OK).json(resInvitation)
  } catch (error) {
    next(error)
  }
}

// Get invitation by User
export const invitationController ={
  createNewBoardInvitation,
  getInvitations
}
