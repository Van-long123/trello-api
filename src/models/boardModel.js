import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './userModel'
import { slugify } from '~/utils/formatters'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(...Object.values(BOARD_TYPES)).required(),
  background: Joi.optional(),
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  // Những admin của board
  ownerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  // Những thành viên của board
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  labels: Joi.array().items({
    id: Joi.string(),
    color: Joi.string(),
    name: Joi.string()
  }).default([
    { 'id': 'lbl1', 'color': '#b6f9d0', 'name': '' },
    { 'id': 'lbl2', 'color': '#f5f18c', 'name': '' },
    { 'id': 'lbl3', 'color': '#ffe3a3', 'name': '' },
    { 'id': 'lbl4', 'color': '#ffcfcf', 'name': '' },
    { 'id': 'lbl5', 'color': '#e5c8fa', 'name': '' },
    { 'id': 'lbl6', 'color': '#4dd4a2', 'name': '' },
    { 'id': 'lbl7', 'color': '#f5cf45', 'name': '' },
    { 'id': 'lbl8', 'color': '#ffa62b', 'name': '' },
    { 'id': 'lbl9', 'color': '#ff6b6b', 'name': '' },
    { 'id': 'lbl10', 'color': '#c77dff', 'name': '' },
    { 'id': 'lbl11', 'color': '#1b998b', 'name': '' },
    { 'id': 'lbl12', 'color': '#a1662f', 'name': '' },
    { 'id': 'lbl13', 'color': '#c44536', 'name': '' },
    { 'id': 'lbl14', 'color': '#ff4d4d', 'name': '' },
    { 'id': 'lbl15', 'color': '#9d4edd', 'name': '' },
    { 'id': 'lbl16', 'color': '#d0e7ff', 'name': '' },
    { 'id': 'lbl17', 'color': '#aee1f9', 'name': '' },
    { 'id': 'lbl18', 'color': '#c6f6d5', 'name': '' },
    { 'id': 'lbl19', 'color': '#ffc6f7', 'name': '' },
    { 'id': 'lbl20', 'color': '#d9d9d9', 'name': '' },
    { 'id': 'lbl21', 'color': '#7ebaff', 'name': '' },
    { 'id': 'lbl22', 'color': '#56ccf2', 'name': '' },
    { 'id': 'lbl23', 'color': '#84d95a', 'name': '' },
    { 'id': 'lbl24', 'color': '#ff70a6', 'name': '' },
    { 'id': 'lbl25', 'color': '#8f8f8f', 'name': '' },
    { 'id': 'lbl26', 'color': '#006eff', 'name': '' },
    { 'id': 'lbl27', 'color': '#0077b6', 'name': '' },
    { 'id': 'lbl28', 'color': '#57cc99', 'name': '' },
    { 'id': 'lbl29', 'color': '#d83367', 'name': '' },
    { 'id': 'lbl30', 'color': '#555555', 'name': '' },
    { 'id': 'lbl31', 'color': '#003f91', 'name': '' },
    { 'id': 'lbl32', 'color': '#005f73', 'name': '' },
    { 'id': 'lbl33', 'color': '#386641', 'name': '' },
    { 'id': 'lbl34', 'color': '#9b2226', 'name': '' },
    { 'id': 'lbl35', 'color': '#343a40', 'name': '' },
    { 'id': 'lbl36', 'color': '#0d1b2a', 'name': '' },
    { 'id': 'lbl37', 'color': '#1b263b', 'name': '' },
    { 'id': 'lbl38', 'color': '#2d6a4f', 'name': '' },
    { 'id': 'lbl39', 'color': '#720026', 'name': '' },
    { 'id': 'lbl40', 'color': '#212529', 'name': '' }
  ]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Chỉ định ra những Fields mà chúng ta không muốn cho phép cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}
const createNew = async (userId, data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne({
      ...validData,
      ownerIds: [new ObjectId(userId)]
    }) //trả về acknowledged:true và insertedId:id nếu create success
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (userId, boardId) => {
  try {
    // User truy cập vào board cụ thể thì nó phải là thành viên của board đó
    const queryConditions = [
      { _id: new ObjectId(boardId) },
      { _destroy: false },
      { $or: [
        { ownerIds: { $all: [new ObjectId(userId)] } },
        { memberIds: { $all: [new ObjectId(userId)] } }
      ] }
    ]
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      // $match kiểu chính xác lọc dữ liệu
      { $match: { $and: queryConditions } },
      { $lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME, // Tên collection cần JOIN
        localField: '_id', //Trường ở collection hiện tại
        foreignField: 'boardId', // Trường ở collection kia (column)
        as: 'columns' // Tên field mới để chứa kết quả JOIN
      } },
      { $lookup: {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'ownerIds',
        foreignField: '_id',
        as: 'owners',
        // pipeline trong lookup là để xử lý một hoặc nhiều luông cần thiết
        // $project để chỉ định vài field không muốn lấy về bằng cách gán nó giá trị
        pipeline: [{ $project: { 'password':0, 'verifyToken':0 } }]
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'memberIds',
        foreignField: '_id',
        as: 'members',
        // pipeline trong lookup là để xử lý một hoặc nhiều luông cần thiết
        // $project để chỉ định vài field không muốn lấy về bằng cách gán nó giá trị
        pipeline: [{ $project: { 'password':0, 'verifyToken':0 } }]
      } }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

//Push giá trị columnId vào cuối mảng columnOrderIds
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(column.boardId)
        // _destroy: false ko cần thiết vì tạo mới column thì chắc chắn có rồi
      }, // điều kiện tìm; nếu ko tìm thấy thì result là null
      {
        $push: { columnOrderIds: new ObjectId(column._id) }
      }, // thao tác cập nhật
      {
        returnDocument: 'after'
      } // trả về document sau khi cập nhật (default là 'before' Trả về document TRƯỚC khi cập nhật)
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (boardId, updateData) => {
  try {
    // Lọc ra những field mà ta không cho phép cập nhật
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    //Đối với dữ liệu liên quan tới ObjectId biến đổi ở đây
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => new ObjectId(_id))
    }

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id ) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  try {
    const queryConditions = [
      // Điều kiện 1 board chưa bị xóa
      { _destroy: false },
      // Điều kiện 02: cái thằng userId đang thực hiện request này nó phải thuộc vào một trong 2
      // cái mảng ownerIds hoặc memberIds, sử dụng toán tử $all của mongodb
      { $or: [
        { ownerIds: { $all: [new ObjectId(userId)] } },
        { memberIds: { $all: [new ObjectId(userId)] } }
      ] }
    ]

    // Xử lý query filter
    if (queryFilters) {
      Object.keys(queryFilters).forEach(key => {
        // Có phân biệt chữ hoa chữ thường
        // queryConditions.push({ [key]: { $regex: queryFilters[key] } })
        // Không phân biệt chữ hoa chữ thường
        if (key === 'title') {
          queryFilters.slugTitle = slugify(queryFilters.title)
          queryConditions.push(
            {
              $or: [
                { [key]: { $regex: new RegExp(queryFilters[key], 'i') } },
                { 'slug': { $regex: new RegExp(slugify(queryFilters[key]), 'i') } }
              ]
            }
          )
        }

      })
    }
    const query = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate(
      [
        { $match: { $and: queryConditions } },
        // sort title của board theo A-Z (mặc định sẽ bị chữ B hoa đứng trước chữ a thường
        { $sort: { title: 1 } },
        // $facet dùng để chạy nhiều (truy vấn con) song song trong cùng một truy vấn aggregation.
        { $facet: {
          // truy vấn 01: Query Boards
          'queryBoards': [
            { $skip: pagingSkipValue(page, itemsPerPage) }, // Bỏ qua số lượng bản ghi của những page trước đó
            { $limit: itemsPerPage } // Giới hạn bản ghi trả về trên 1 page
          ],
          // truy vấn 02: Query đếm tất cả  số lượng bản ghi Board trong DB trả về vào biến countedAllBoards
          //  $count sẽ tự động đếm số lượng bản ghi đã được lọc bởi $match phía trên.
          'queryTotalBoards': [
            { $count: 'countedAllBoards' }
          ]
        } }

      ],
      { collation: { locale: 'en' } }
    ).toArray()
    const res = query[0]
    return {
      // boards: res.queryBoards || [],
      boards: res.queryBoards,
      totalBoards:res.queryTotalBoards[0]?.countedAllBoards || 0
    }
  } catch (error) {
    throw new Error(error)
  }
}

const pushMemberIds = async (boardId, userId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $push: { memberIds: new ObjectId(userId) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  getBoards,
  pushMemberIds
}
