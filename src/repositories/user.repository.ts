import { db } from '../db'
import { User } from '../models/user.model'

export const getUserById = async (id: string): Promise<User> => await db()('users').where('id', id).first()

export const getUserByLogin = async (login: string): Promise<User> => await db()('users').where('login', login).first()

export const saveUser = async (user: User): Promise<void> => {
	await db()('users').insert(user)
}

export const updateUser = async (user: User): Promise<void> => {
	await db()('users').update(user).where('id', user.id)
}

export const deleteUser = async (id: string): Promise<void> => {
	await db()('users').delete().where('id', id)
}
