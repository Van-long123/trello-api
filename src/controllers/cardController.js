import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
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
export const cardController = {
  createNew,
  update,
  createAttachInCard
}
