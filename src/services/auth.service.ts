import jwt from 'jsonwebtoken'
import moment from 'moment'
import fs from 'fs'
import { v4 as uuid } from 'uuid'
import { JwtType } from '../commons/models/jwt.model'
import { User } from '../models/user.model'
import { getUserByLogin } from '../repositories/user.repository'
import { saveToken, updateToken, isActiveToken } from '../repositories/token.repository'
import { validatePassword } from '../services/user.service'
import { Token } from '../models/token.model'
import { generate as generateKey, serialize } from './jwks.service'
import { Jwks } from '../models/jwks.model'
import { validation, decode } from '../commons/services/auth.service'

const keyPath = `${global.appRoot}/keys`

export const login = async (login: string, password: string): Promise<Token> => {
	const user: User | undefined = await getUserByLogin(login)
	if (!user || (user && !(await validatePassword(password, user.password)))) {
		throw new Error('401')
	}
	return generate(user.id)
}

export const refresh = async (token: string): Promise<Token> => {
	if (await !validation(token, JwtType.REFRESH)) {
		throw new Error('401')
	}
	const { jti, sub } = await decode(token)
	if (await !isActiveToken(jti)) {
		throw new Error('401')
	}
	return generate(sub)
}

export const logout = async (token: string): Promise<void> => {
	if (await !validation(token, JwtType.REFRESH)) {
		throw new Error('401')
	}
	await updateToken(await decode(token), false)
}

export const jwks = async (): Promise<Jwks> => {
	try {
		await fs.promises.access(`${keyPath}/public.pem`, fs.constants.F_OK)
	} catch (err) {
		await generateKey()
	}

	const publicKey = await fs.promises.readFile(`${keyPath}/public.pem`)

	return serialize([
		{
			kid: '1',
			use: 'sig',
			publicKey
		}
	])
}

const generate = async (sub: string): Promise<Token> => ({
	access: await generateJWT(sub, JwtType.ACCESS, 15),
	refresh: await generateJWT(sub, JwtType.REFRESH, 90)
})

const generateJWT = async (sub: string, typ: JwtType, dur: number): Promise<string> => {
	const secretOrKey = await getSecretOrKey()
	const alg = getAlgorithm()
	const iat = moment()
	const jti = uuid()
	const token = jwt.sign(
		{
			jti,
			sub,
			typ,
			iat: iat.unix(),
			exp: iat.add(dur, 'm').unix()
		},
		secretOrKey,
		{ algorithm: alg }
	)
	if (typ === JwtType.REFRESH) {
		await saveToken(await decode(token), true)
	}
	return token
}

const getSecretOrKey = async (): Promise<Buffer | string> => {
	const alg = process.env.JWT_ALG
	if (alg && alg === 'RSA') {
		try {
			await fs.promises.access(`${keyPath}/private.pem`, fs.constants.F_OK)
		} catch (err) {
			await generateKey()
		}

		return await fs.promises.readFile(`${keyPath}/private.pem`)
	} else {
		return process.env.JWT_SECRET || 'secret'
	}
}

const getAlgorithm = (): 'RS512' | 'HS512' => {
	const alg = process.env.JWT_ALG
	if (alg && alg === 'RSA') {
		return 'RS512'
	} else {
		return 'HS512'
	}
}
