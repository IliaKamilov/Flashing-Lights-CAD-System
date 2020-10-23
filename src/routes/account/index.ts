import { Router } from 'express'
import { useAccountCorsOption } from '../../constants/cors'
import Login from './Login'

const router = Router()

router.post('/login', useAccountCorsOption, Login)

export default router