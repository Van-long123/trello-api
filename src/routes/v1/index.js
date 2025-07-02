import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoutes'
const router = express.Router()

/** Check APIs V1/status */
router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'APIs V1 are ready to use',
    code: StatusCodes.OK
  })
})
/** Board APIs */
router.use('/boards', boardRoutes)

export const APIs_V1 = router