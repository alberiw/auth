import { Request, Response, NextFunction } from 'express'
import { validation, decode } from '../services/auth.service'
import { JwtType } from '../models/jwt.model'

const BEARER = 'Bearer'

export const middleware = (req: Request, res: Response, next: NextFunction): any => {
	if (!req.headers.authorization) {
		return res.status(401).send({ error: 'Authorization is missing' })
	}
	const [authorizationType, token]: string[] = req.headers.authorization.split(' ')
	if (authorizationType !== BEARER) {
		return res.status(401).send({ error: 'Authorization type is invalid' })
	}
	if (!validation(token, JwtType.ACCESS)) {
		return res.status(401).send({ error: 'Token is invalid' })
	}
	req.user = decode(token).sub
	next()
}
