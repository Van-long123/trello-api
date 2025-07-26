import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { sendMail } from '~/utils/sendMail'
import { env } from '~/config/environment'
import { jwtProvider } from '~/providers/JwtProvider'

const createNew = async (reqBody) => {
  try {
    // Kiểm tra xem email có tồn tại trong Database chưa
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    // Tạo Data để lưu vào Database
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail, // Mặc định để giống username khi tạo mới, sau thì có làm tính năng update lại user
      verifyToken: uuidv4()
    }

    // Thực hiện lưu thông tin user vào DB
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Trello App: Please verify your email before using our services!'
    const htmlContent = `
      <div style="
        background: #ffffff; 
        max-width: 600px; 
        margin: 0 auto; 
        border-radius: 16px; 
        box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.2);
      ">
      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        padding: 40px 20px; 
        text-align: center; 
        color: white;
        ">
        <div style="
          background: rgba(255,255,255,0.2); 
          width: 80px; 
          height: 80px; 
          border-radius: 50%; 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          margin-bottom: 20px;
          ">
          <span style="font-size: 36px; width: 100%; margin: 6px 0 0 10px">🔐</span>
        </div>
        <h1 style="
          margin: 0; 
          font-size: 28px; 
          font-weight: 600; 
          letter-spacing: -0.5px;
        ">Verify Your Email</h1>
      </div>

      <!-- Content -->
      <div style="padding: 40px 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="
            color: #2d3748; 
            font-size: 20px; 
            font-weight: 500; 
            margin: 0 0 15px 0; 
            line-height: 1.4;
          ">Hello there! 👋</h2>
          <p style="
            color: #718096; 
            font-size: 16px; 
            line-height: 1.6; 
            margin: 0 auto; 
            max-width: 400px;
          ">
            We received a request to verify your email address. Click the button below to complete the verification process.
          </p>
        </div>

        <!-- Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationLink}" style="
            display: inline-block; 
            padding: 16px 32px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: #ffffff; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: 600; 
            font-size: 16px; 
            letter-spacing: 0.5px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          ">
            ✅ Verify Email Address
          </a>
        </div>

        <!-- Security notice -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="
            color: #a0aec0; 
            font-size: 14px; 
            line-height: 1.5; 
            margin: 0;
          ">
            🛡️ If you didn't request this verification, you can safely ignore this email.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="
          background: #f8fafc; 
          padding: 30px; 
          text-align: center; 
          border-top: 1px solid #e2e8f0;
      ">
        <p style="
            color: #a0aec0; 
            font-size: 12px; 
            margin: 0; 
            line-height: 1.4;
        ">
          This email was sent from <strong>Trello</strong><br>
          125 Cửa Đại, Hội An
        </p>
      </div>
    </div>
    `
    // Thực hiện gửi mail
    // await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)
    sendMail(getNewUser.email, customSubject, htmlContent)

    // Return về dữ liệu cho Controller
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already!')
    if (existUser.verifyToken !== reqBody.token) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')

    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const updatedUser = await userModel.update(existUser._id, updateData)
    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.FORBIDDEN, 'Your account is not active!')
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!')
    }
    // Nếu mọi thứ ok thì bắt đầu tạo Tokens đăng nhập để trả về cho phía FE
    // Tạo thông tin để đính kèm trong JWT Token: bao gồm id và email của user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }
    // Tạo ra 2 loại token, accessToken và refreshToken để trả về cho phía FE
    const accessToken = await jwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      env.ACCESS_TOKEN_LIFE
      // 4
    )

    const refreshToken = await jwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_PRIVATE_KEY,
      env.REFRESH_TOKEN_LIFE
    )
    // Trả về thông tin của user kèm theo 2 cái token vừa tạo
    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login
}
