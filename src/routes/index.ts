import { Router } from 'express'
import AccountRoutes from './account'
import EnterName from './Enter'

const router = Router()

router.use('/enter', EnterName)

router.use('/account', AccountRoutes)

export default router