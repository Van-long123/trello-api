/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
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
export const boardService = {
  createNew
}