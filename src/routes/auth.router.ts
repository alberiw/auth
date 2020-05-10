import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'

export const router = Router()

router.post('/login', AuthController.login)

router.post('/refresh', AuthController.refresh)

router.get('/jwks', AuthController.jwks)

router.post('/logout', AuthController.logout)
