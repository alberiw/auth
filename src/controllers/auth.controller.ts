import { Request, Response } from 'express'
import { ILoginDto } from '../dto/auth.dto'
import { ITokenDto } from '../dto/token.dto'
import { Token } from '../models/token.model'
import { logout, refresh as refreshToken, login, jwks } from '../services/auth.service'

interface IAuthController {
	login(req: Request, res: Response): Promise<void>
	refresh(req: Request, res: Response): Promise<void>
	logout(req: Request, res: Response): Promise<void>
	jwks(req: Request, res: Response): Promise<void>
}

export const AuthController: IAuthController = {
	async login(req: Request, res: Response): Promise<void> {
		const userDto: ILoginDto = req.body
		try {
			const { access, refresh }: Token = await login(userDto.login, userDto.password)
			const response: ITokenDto = {
				access,
				refresh
			}
			res.send(response)
		} catch (err) {
			console.log(err)
			res.status(401).send({ error: 'Wrong login and/or password' })
		}
	},
	async refresh(req: Request, res: Response): Promise<void> {
		const token: string = req.body
		try {
			const { access, refresh }: Token = await refreshToken(token)
			const response: ITokenDto = {
				access,
				refresh
			}
			res.send(response)
		} catch (err) {
			console.log(err)
			res.status(401).send({ error: 'Unauthorized' })
		}
	},
	async logout(req: Request, res: Response): Promise<void> {
		const token: string = req.body
		try {
			await logout(token)
			res.sendStatus(200)
		} catch (err) {
			console.log(err)
			res.status(401).send({ error: 'Unauthorized' })
		}
	},
	async jwks(req: Request, res: Response): Promise<void> {
		const result = await jwks()
		res.send(result)
	}
}
