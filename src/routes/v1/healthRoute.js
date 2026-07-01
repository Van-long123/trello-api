import express from 'express'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

const buildHealthPayload = () => ({
  status: 'OK',
  timestamp: Date.now(),
  uptime: process.uptime()
})

router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json(buildHealthPayload())
})

export const healthRoute = router