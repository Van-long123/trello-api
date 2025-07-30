import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { ALLOW_FILE_TYPES, LIMIT_FILE_SIZE } from '~/utils/validators'

//  Function kiểm tra loại file nào được chấp nhận
const customFileFilter = (req, file, callback) => {
  // console.log('🚀 ~ customFileFilter ~ file:', file)
  // Đối với thằng multer kiểm tra kiểu file thì sử dụng mimetype
  if (!ALLOW_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    // Nếu có lỗi thì truyền error vào tham số thứ nhất;
    // tham số thứ 2 là thành công truyền null
    return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage), null)
  }

  // Nếu như kiểu file hợp lệ
  // null có nghĩa là ko có lỗi
  // true thanh công đi qua
  return callback(null, true)
}

// Khởi tao function upload file bằng multer
const upload = multer({
  // kiểm tra giới hạn của file
  limits: { fileSize:LIMIT_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }
