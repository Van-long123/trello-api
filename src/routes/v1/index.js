import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'
import { userRoute } from './userRoute'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationRoute } from './invitationRoute'
import { healthRoute } from './healthRoute'

const router = express.Router()

/** Health check APIs V1 */
router.use('/', healthRoute)
/** Board APIs */
router.use('/boards', boardRoute)
/** Columns APIs */

router.use('/columns', authMiddleware.isAuthorized, columnRoute)
/** Cards APIs */
router.use('/cards', cardRoute)

/** User APIs */
router.use('/users', userRoute)

/** Invitation APIs */
router.use('/invitations', authMiddleware.isAuthorized, invitationRoute)

export const APIs_V1 = router