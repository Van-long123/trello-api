import { WHITELIST_ORIGIN } from '~/utils/constants'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Cấu hình CORS Option
export const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,
    // Thông thường khi sử dụng postman thì cái origin sẽ có giá trị là undefined
    //khi chúng ta deploy dự án lên một Server Production thì sẽ sửa lại đoạn này thêm một chút nữa để phù hợp với từng môi trường production hoặc dev.
    if (!origin && env.BUILD_MODE === 'dev') {
      return callback(null, true)
    }

    // Kiểm tra xem origin có phải là origin được chấp nhận hay không
    if (WHITELIST_ORIGIN.includes(origin)) {
      return callback(null, true) //null có nghĩa là ko có lỗi, true là cho phép đi qua để truy cập tài nguyên
    }

    // Cuối cùng nếu origin không được chấp nhận thì trả về lỗi
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  // thư viện cors mặc định trả về status 204 No Content.
  // là để tránh lỗi khi trình duyệt cũ không hiểu hoặc không chấp nhận mã phản hồi mặc định 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request,
  //đính kèm jwt access token và refresh token vào httpOnly Cookies,axios call API sẽ đính kèm cookie vào request
  //để được cookie ấy và pass qua được cors thì phải có credentials: true
  credentials: true
}
