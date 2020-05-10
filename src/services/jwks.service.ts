// https://tools.ietf.org/html/rfc7517

import NodeRSA from 'node-rsa'
import fs from 'fs'
import { Jwk, Jwks } from '../models/jwks.model'

const keyPath = `${global.appRoot}/keys`

interface JWKSRequest {
	kid: string
	use: 'sig' | 'enc'
	publicKey: NodeRSA.Key
}

export const generate = async (): Promise<void> => {
	const rsa = new NodeRSA({ b: 512 })
	rsa.generateKeyPair()

	try {
		await fs.promises.access(keyPath, fs.constants.F_OK)
	} catch (err) {
		await fs.promises.mkdir(keyPath)
	}

	const privateKey = rsa.exportKey('private')
	await fs.promises.writeFile(`${keyPath}/private.pem`, privateKey)

	const publicKey = rsa.exportKey('public')
	await fs.promises.writeFile(`${keyPath}/public.pem`, publicKey)
}

export const serialize = (keys: JWKSRequest[]): Jwks => ({ keys: keys.map((key) => serializeKey(key)) })

const serializeKey = ({ kid, use, publicKey }: JWKSRequest): Jwk => {
	const { n, e } = new NodeRSA(publicKey).exportKey('components-public')

	const strN = n.toString('base64')

	const bufE = Buffer.alloc(4)
	bufE.writeInt32BE(e as number, 0)
	const strE = bufE.slice(1).toString('base64')

	return {
		kid,
		use,
		alg: 'RS512',
		kty: 'RSA',
		n: strN,
		e: strE
	}
}
