import { StatusCodes } from 'http-status-codes'
import { invitationModel } from '~/models/invitationModel'
import { boardModel } from '~/models/boardModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { sendMail } from '~/utils/sendMail'
import { env } from '~/config/environment'
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'

const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    // Người đi mời chính là người request
    const inviter = await userModel.findOneById(inviterId)
    // Người được mời
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    // Tìm board để lấy data xử lý
    const board = await boardModel.findOneById(reqBody.boardId)

    //Nếu ko tồn tại 1 trong 3 thì throw lỗi về
    if (!inviter || !invitee || !board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, Invitee or Board not found!')
    }

    // Tạo data cần thiết để lưu vào Db
    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(), // Chuyển từ ObjectId về String vif sang bên Model có check lại Data ở hàm create
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING // Mặc định ban đầu sẽ là pending
      }
    }

    // Gọi sang Model để lưu vào DB
    const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
    const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    //Ngoài thông tin cảu các board invitation mới tạo thì trả về đủ luôn cả board, inviter, invitee cho FE xử lý
    const resInvitation = {
      ...getInvitation,
      board,
      invitee: pickUser(invitee),
      inviter: pickUser(inviter)
    }
    return resInvitation
  } catch (error) {
    throw error
  }
}

const getInvitations = async (userId) => {
  try {
    const getInvitations = await invitationModel.findByUser(userId)
    // Vì các dữ liệu inviter, invitee và board là đang ở giá trị mảng 1 phần tử nên chúng ta biến đổi nó về Json Object trước khi trả về
    const resInvitations = getInvitations.map(item =>
      (
        {
          ...item,
          inviter:item.inviter[0] || {},
          invitee:item.invitee[0] || {},
          board:item.board[0] || {}
        }
      ))
    return resInvitations
  } catch (error) {
    throw error
  }
}

const updateBoardInvitation = async (userId, notificationId, status) => {
  try {
    // Tìm bản ghi invitation trong model
    const getInvitation = await invitationModel.findOneById(notificationId)
    if (!getInvitation) throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found')

    // sau khi có Invitaion rồi thì lấy full thông tin của board
    const boardId = getInvitation.boardInvitation.boardId
    const board = await boardModel.findOneById(boardId)
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')

    // Kiểm tra xem nếu status là ACCEPTED join board mà cái thằng user (invitee) đã là owner hoặc member
    // của board rồi thì trả về thông báo lỗi luôn.
    // 2 mảng memberIds và ownerIds của board nó đang là kiểu dữ liệu ObjectId nên cho nó về String
    // hết luôn để check
    const boardOwnerAndMemberIds = [...board.ownerIds, ...board.memberIds].toString()
    if (status === BOARD_INVITATION_STATUS.ACCEPTED && boardOwnerAndMemberIds.includes(userId)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'You are already member of this board.')
    }

    // Tạo dữ liệu để update bản ghi Invitation
    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status
      }
    }

    // Cập nhật status trong bản ghi Invitation
    const updatedInvitation = await invitationModel.update(notificationId, updateData)

    // Nếu trường hợp Accept một lời mời thành công, thì cần phải thêm thông tin của thằng user (userId) vào bản ghi memberIds trong collection board.
    if (updatedInvitation.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMemberIds(boardId, userId)
    }
    return updatedInvitation
  } catch (error) {
    throw error
  }
}

export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}
