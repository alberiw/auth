import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import moment from 'moment'
import { Jwt, JwtType } from '../models/jwt.model'
import { promisify } from 'bluebird'

export const validation = async (token: string, typ: JwtType): Promise<boolean> => {
	try {
		const secretOrKey = await getSecretOrKey()
		jwt.verify(token, secretOrKey)

		const decoded = decode(token)
		const now = moment().unix()
		if (decoded.exp && decoded.exp > now && decoded.typ && decoded.typ === typ) {
			return true
		}
	} catch (err) {
		console.log(err)
	}
	return false
}

export const decode = (token: string): Jwt => {
	const decoded = jwt.decode(token)
	if (!decoded || typeof decoded === 'string') {
		throw new Error('400')
	}
	return {
		jti: decoded.jti,
		sub: decoded.sub,
		typ: decoded.typ,
		iat: decoded.iat,
		exp: decoded.exp
	}
}

const getSecretOrKey = async (): Promise<string> => {
	const alg = process.env.JWT_ALG
	if (alg && alg === 'RSA') {
		const jwksUri = process.env.JWKS_URI || 'http://localhost:8080/auth/jwks'
		const client = jwksClient({ jwksUri })
		const kid = '1'
		const key = await promisify(client.getSigningKey)(kid)
		return key.getPublicKey()
	} else {
		return process.env.JWT_SECRET || 'secret'
	}
}
