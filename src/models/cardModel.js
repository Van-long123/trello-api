import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { CARD_MEMBER_ACTION } from '~/utils/constants'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  //optional là description không bắt buộc phải có field trong reqBody.
  description: Joi.string().optional(),
  cover: Joi.string().default(null),

  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  // Dữ liệu comment sẽ nằm ở CardModel luôn không cần tạo 1 collection khác
  comments: Joi.array().items({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    userAvatar: Joi.string(),
    userDisplayName: Joi.string(),
    content: Joi.string(),
    // Chỗ này lưu ý vì dùng hàm $push để thêm comment nên không set default Date.now luôn giống hàm insertone khi create được.
    commentedAt: Joi.date().timestamp(),
    reactions: Joi.array().default([])
  }).default([]),

  attachments: Joi.array().items({
    fileName: Joi.string(),
    fileType: Joi.string(),
    fileUrl: Joi.string(),
    createdAt: Joi.date().timestamp()
  }).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }
    const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    return createdCard
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    // Lọc ra những field mà ta không cho phép cập nhật
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    //Đối với dữ liệu liên quan tới ObjectId biến đổi ở đây
    if (updateData.columnId) updateData.columnId = new ObjectId(updateData.columnId)

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({
      columnId: new ObjectId(columnId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const unShiftNewComment = async (cardId, commentData) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id:new ObjectId(cardId) },
      { $push: { comments: { $each:[commentData], $position:0 } } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const unShiftNewAttachment = async (cardId, attachmentData) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id:new ObjectId(cardId) },
      { $push: { attachments: { $each:[attachmentData], $position:0 } } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateMembers = async (cardId, incomingMemberInfo) => {
  try {
    let updateCondition = {}
    if (incomingMemberInfo.action === CARD_MEMBER_ACTION.ADD) {
      updateCondition = { $push: { memberIds: new ObjectId(incomingMemberInfo.userId) } }
    }
    if (incomingMemberInfo.action === CARD_MEMBER_ACTION.REMOVE) {
      updateCondition = { $pull: { memberIds: new ObjectId(incomingMemberInfo.userId) } }
    }

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      updateCondition,
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateUserInfoInComments = async (userId, updateData) => {
  try {
    const updateField = `comments.$[elem].${updateData.fieldUpdate}`
    await GET_DB().collection(CARD_COLLECTION_NAME).updateMany(
      { 'comments.userId': userId },
      {
        $set: {
          [updateField]: updateData.displayName
        }
      },
      {
        arrayFilters: [{ 'elem.userId': userId }]
      }
    )
  } catch (error) {
    throw new Error(error)
  }
}

const updateComment = async (cardId, commentToUpdate) => {
  try {
    const result =await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(cardId),
        'comments.commentedAt': commentToUpdate.commentedAt
      },
      {
        $set: { 'comments.$.content': commentToUpdate.content }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteComment = async (cardId, commentToDelete) => {
  try {
    const result =await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(cardId)
      },
      {
        $pull: { comments: { commentedAt: commentToDelete.commentedAt } }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const attachmentToUpdate = async (cardId, attachmentToUpdate) => {
  try {
    const result =await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(cardId),
        'attachments.createdAt': attachmentToUpdate.createdAt
      },
      {
        $set: { 'attachments.$.fileName': attachmentToUpdate.fileName }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const deleteAttachment = async (cardId, attachmentToDelete) => {
  try {
    const result =await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(cardId)
      },
      {
        $pull: { attachments: { createdAt: attachmentToDelete.createdAt } }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateReactionInComment = async (cardId, userId, commentReactionsToUpdate) => {
  try {
    const { emoji, commentedAt } = commentReactionsToUpdate
    const card = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(cardId)
    })
    if (!card) throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')

    const comment = card.comments.find(c => c.commentedAt === commentedAt )
    if (!comment) throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found')
    let reaction = comment.reactions.find(r => r.emoji === emoji)
    if (!reaction) {
      comment.reactions.push({ emoji, count: 1, users: [userId] })
    }
    else {
      // eslint-disable-next-line no-lonely-if
      if (reaction.users.includes(userId)) {
        reaction.count -= 1
        reaction.users = reaction.users.filter(u => u !== userId)
        if (reaction.count === 0) {
          comment.reactions = comment.reactions.filter(r => r.emoji !== emoji)
        }
      }
      else {
        reaction.count += 1
        reaction.users.push(userId)
      }
    }

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId), 'comments.commentedAt': commentedAt },
      { $set: { 'comments.$': comment } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId,
  unShiftNewComment,
  updateMembers,
  updateUserInfoInComments,
  updateComment,
  deleteComment,
  updateReactionInComment,
  unShiftNewAttachment,
  deleteAttachment,
  attachmentToUpdate
}
