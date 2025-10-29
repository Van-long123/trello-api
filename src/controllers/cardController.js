import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
import ApiError from '~/utils/ApiError'
import { sendMail as sendMailShareCard } from '~/utils/sendMail'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const cardCoverFile = req.file
    const userInfo = req.jwtDecoded
    console.log('🚀 ~ update ~ userInfo:', userInfo)
    const updatedCard = await cardService.update(cardId, cardCoverFile, req.body, userInfo)
    res.status(StatusCodes.CREATED).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

const createAttachInCard = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const file = req.file
    const updatedCard = await cardService.createAttachInCard(cardId, file, req.body)
    res.status(StatusCodes.CREATED).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

const watchCard = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const userId = req.jwtDecoded._id
    const updatedColumn = await cardService.watchCard(cardId, userId)

    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) {
    next(error)
  }
}

const unwatchCard = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const userId = req.jwtDecoded._id
    const result = await cardService.unwatchCard(cardId, userId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNewCopy = async (req, res, next) => {
  try {
    const createdColumn = await cardService.createNewCopy(req.body)
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

const shareCard = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const updatedCard = await cardService.shareCard(cardId)
    res.status(StatusCodes.CREATED).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

const sendMail = async (req, res, next) => {
  try {
    const shareLink = `${req.body.shareUrl}`
    const customSubject = 'Trello App: A card has been shared with you!'

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
        background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%); 
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
          margin: 0 auto
        ">
          <span style="font-size: 36px;">📋</span>
        </div>
        <h1 style="
          margin: 0; 
          font-size: 26px; 
          font-weight: 600; 
          letter-spacing: -0.5px;
        ">You've Been Invited to View a Trello Card</h1>
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
          ">Hello 👋</h2>
          <p style="
            color: #718096; 
            font-size: 16px; 
            line-height: 1.6; 
            margin: 0 auto; 
            max-width: 440px;
          ">
            Someone has shared a Trello card with you.  
            Click the button below to view it online.
          </p>
        </div>

        <!-- Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${shareLink}" style="
            display: inline-block; 
            padding: 16px 32px; 
            background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%); 
            color: #ffffff; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: 600; 
            font-size: 16px; 
            letter-spacing: 0.5px;
            box-shadow: 0 8px 25px rgba(0, 176, 155, 0.4);
          ">
            🔗 View Shared Card
          </a>
        </div>

        <!-- Info -->
        <div style="text-align: center; margin-top: 20px;">
          <p style="
            color: #a0aec0; 
            font-size: 14px; 
            line-height: 1.5; 
            margin: 0;
          ">
            You can view this card in read-only mode.<br>
            To collaborate, ask the board owner for edit access.
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
          125 Cửa Đại, Hội An<br>
          Please do not reply to this email.
        </p>
      </div>
    </div>
    `
    sendMailShareCard(req.body.email, customSubject, htmlContent)
    res.status(StatusCodes.OK).json('success')
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, 'Try Again!')
  }
}

const publicCard = async (req, res, next) => {
  try {
    const shareToken = req.params.shareToken
    const card = await cardService.publicCard(shareToken)
    res.status(StatusCodes.CREATED).json(card)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew,
  update,
  createAttachInCard,
  watchCard,
  unwatchCard,
  createNewCopy,
  shareCard,
  sendMail,
  publicCard
}
