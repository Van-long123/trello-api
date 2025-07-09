import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'
const router = express.Router()

/** Check APIs V1/status */
router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'APIs V1 are ready to use',
    code: StatusCodes.OK
  })
})
/** Board APIs */
router.use('/boards', boardRoute)
/** Columns APIs */
router.use('/columns', columnRoute)
/** Cards APIs */
router.use('/cards', cardRoute)
export const APIs_V1 = router