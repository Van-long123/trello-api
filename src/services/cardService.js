import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/cloudinaryProvider'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, cardCoverFile, reqBody, userInfo) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    let updatedCard = {}
    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      updatedCard = await cardModel.update(cardId, {
        ...updateData, cover: uploadResult.secure_url
      })
    } else if (updateData.commentToAdd) {
      // Tạo dữ liệu comment để thêm vào DB
      const commentData = {
        ...updateData.commentToAdd,
        commentedAt: Date.now(),
        userEmail:userInfo.email,
        userId:userInfo._id
      }
      updatedCard = await cardModel.unShiftNewComment(cardId, commentData)
    } else if (updateData.incomingMemberInfo) {
      updatedCard = await cardModel.updateMembers(cardId, updateData.incomingMemberInfo)
    } else if (updateData.commentToUpdate) {
      updatedCard = await cardModel.updateComment(cardId, updateData.commentToUpdate)
    } else if (updateData.commentToDelete) {
      updatedCard = await cardModel.deleteComment(cardId, updateData.commentToDelete)
    }
    else {
      // Các trường hợp update chung như title, description
      updatedCard = await cardModel.update(cardId, updateData)
    }
    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update
}
