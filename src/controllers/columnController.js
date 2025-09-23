import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'
const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

const createNewCopy = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNewCopy(req.body)
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const updatedColumn = await columnService.update(columnId, req.body)

    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) {
    next(error)
  }
}

const deleteItem = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const result = await columnService.deleteItem(columnId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const watchColumn = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const userId = req.jwtDecoded._id
    const updatedColumn = await columnService.watchColumn(columnId, userId)

    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) {
    next(error)
  }
}

const unwatchColumn = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const userId = req.jwtDecoded._id
    const result = await columnService.unwatchColumn(columnId, userId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew,
  update,
  deleteItem,
  watchColumn,
  unwatchColumn,
  createNewCopy
}
