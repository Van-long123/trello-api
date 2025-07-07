/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug:slugify(reqBody.title)
    }
    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    //....
    const createdBoard = await boardModel.createNew(newBoard)
    //Lấy bản ghi board sau khi thêm
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId.toString())

    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án...vv
    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo...vv

    return getNewBoard
  } catch (error) {
    throw error
  }
}


const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')

    const resBoard = cloneDeep(board)
    // Đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}
export const boardService = {
  createNew,
  getDetails
}