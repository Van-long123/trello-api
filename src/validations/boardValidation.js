import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
const createNew = async (req, res, next) => {
/*Note: Mặc định chúng ta không cần phải custom message validate ở phía BE làm gì vì để cho Front-end tự
validate và custom message phía FE cho đẹp. I
* Back-end chỉ cần validate Đảm Bảo Dữ Liệu Chuẩn Xác, và trả về message mặc định từ thư viện là được.
* Quan trọng; Việc Validate dữ liệu BẮT BUỘC phải có ở phía Back-end vì đây là điểm cuối để lưu trữ dữ
liệu vào Database.
* Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả Back-end
và Front-end.
*/
  //Tạo điều kiện để validate dữ liệu từ Fe gửi lên
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Yêu cầu phải có tiêu đề',
      'string.empty': 'Tiêu đề không được để trống',
      'string.min': 'Tiêu đề tối thiểu 3 ký tự',
      'string.max': 'Tiêu đề tối đa 50 ký tự',
      'string.trim': 'Tiêu đề không được có khoảng trắng ở đầu hoặc cuối'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })
  try {
    // console.log(req.body)
    // Kiểm tra dữ liệu Fe gửi lên có đúng với điều kiện ko
    // await correctCondition.validateAsync(undefined)
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    // console.log(error.message)
    // console.log(new Error(error).message)
    //error là thư viện tự sinh ra
    // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    //   errors: new Error(error).message
    // })
  }
}
export const boardValidation = {
  createNew
}