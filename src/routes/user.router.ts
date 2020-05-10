import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { middleware } from '../commons/middleware/auth.middleware'

export const router = Router()

router.post('', UserController.createUser)

router.put('/:userId/password', middleware, UserController.changePassword)

router.delete('/:userId', middleware, UserController.deleteUser)
