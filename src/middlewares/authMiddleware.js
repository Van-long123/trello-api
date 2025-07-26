import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { jwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

// Middleware này để Xác thực cái JWT accessToken nhận được từ phía FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  // lấy accessToken nằm trong request cookie phía client gửi lên
  const clientAccessToken = req.cookies?.accessToken

  // Nếu clientAccessToken không tồn tại thì trả về lỗi
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }

  try {
    // Bước 01: Thực hiện giải mã token xem nó có hợp lệ hay là không
    const accessTokenDecoded = await jwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_PRIVATE_KEY)

    // Bước 02: Quan trọng: Nếu như cái token hợp lệ, thì sẽ cần phải lưu thông tin giải mã được vào cái req.jwtDecoded,
    // để sử dụng cho các tầng cần xử lý ở phía sau
    req.jwtDecoded = accessTokenDecoded
    // Bước 03: Cho phép cái request đi tiếp
    next()
  } catch (error) {
    // Nếu cái accessToken nó bị hết hạn (expired) thì mình cần trả về một cái mã lỗi cho phía FE biết để gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
      return
    }

    // Nếu như cái accessToken nó không lợp lệ do bất kỳ điều gì khác vụ hết hạn thì chúng ta cứ thẳng tay trả về mã 401 cho phía FE gọi api sign_out luôn
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = { isAuthorized }
