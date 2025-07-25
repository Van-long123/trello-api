import Jwt from 'jsonwebtoken'

/**
 * Function tạo mới một token - Cần 3 tham số đầu vào
  *userInfo: Những thông tin muốn đính kèm vào token
  *privateKey: Chữ ký bí mật (dạng một chuỗi string ngẫu nhiên) trên
  *tokenLife: Thời gian sống của token
 */
const generateToken = async (userInfo, privateKey, tokenLife) => {
  try {
    // algorithm mặc đinh là HMAC SHA256 là HS256
    return Jwt.sign(userInfo, privateKey, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) {
    throw new Error(error)
  }
}

// Function kiểm tra một token có hợp lệ hay không
const verifyToken = async (token, privateKey) => {
  try {
    return Jwt.verify(token, privateKey)
  } catch (error) {
    throw new Error(error)
  }
}

export const jwtProvider = {
  generateToken,
  verifyToken
}
