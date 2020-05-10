import { db } from '../db'
import { Jwt } from '../commons/models/jwt.model'

export const getToken = async (jti: string): Promise<Jwt> => await db()('tokens').where('jti', jti).first()

export const saveToken = async (token: Jwt, active: boolean): Promise<void> => {
	await db()('tokens').insert({ ...token, active })
}

export const updateToken = async (token: Jwt, active: boolean): Promise<void> => {
	await db()('tokens').update({ ...token, active })
}

export const deleteToken = async (jti: string): Promise<void> => {
	await db()('tokens').delete().where('jti', jti)
}

export const isActiveToken = async (jti: string): Promise<boolean> => await db()('tokens').select('active').where('jti', jti).first()
