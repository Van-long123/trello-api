import express from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'API get list boards',
      code: StatusCodes.OK
    })
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({
      message: 'API create new board',
      code: StatusCodes.CREATED
    })
  })

export const boardRoutes = Router