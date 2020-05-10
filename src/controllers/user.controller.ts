import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { ICreateUserOptionDto, IChangePasswordDto } from '../dto/user.dto'
import { createUser, deleteUser, changePassword } from '../services/user.service'

interface IUserController {
	createUser(req: Request, res: Response): Promise<void>
	deleteUser(req: Request, res: Response): Promise<void>
	changePassword(req: Request, res: Response): Promise<void>
}

export const UserController: IUserController = {
	async createUser(req: Request, res: Response): Promise<void> {
		const userDto: ICreateUserOptionDto = req.body
		try {
			await createUser({
				id: uuid(),
				login: userDto.login,
				password: userDto.password
			})
			res.sendStatus(201)
		} catch (err) {
			console.log(err)
			res.status(400).send({ error: 'User with given login exist' })
		}
	},
	async deleteUser(req: Request, res: Response): Promise<void> {
		const id: string = req.params.userId
		try {
			await deleteUser(id)
			res.sendStatus(200)
		} catch (err) {
			console.log(err)
			res.sendStatus(400)
		}
	},
	async changePassword(req: Request, res: Response): Promise<void> {
		const id: string = req.params.userId
		const changePasswordDto: IChangePasswordDto = req.body
		try {
			await changePassword({
				id: id,
				oldPassword: changePasswordDto.oldPassword,
				newPassword: changePasswordDto.newPassword
			})
			res.sendStatus(200)
		} catch (err) {
			console.log(err)
			res.status(401).send({ error: 'Unauthorized' })
		}
	}
}
