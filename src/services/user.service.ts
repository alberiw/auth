import bcrypt from 'bcrypt'
import { User, ChangePassword } from '../models/user.model'
import { getUserById, saveUser, updateUser, deleteUser as deleteUsr } from '../repositories/user.repository'

export const createUser = async (user: User): Promise<void> => {
	const hash: string = await bcrypt.hash(user.password, 10)
	await saveUser({
		id: user.id,
		login: user.login,
		password: hash
	})
}

export const deleteUser = async (id: string): Promise<void> => {
	await deleteUsr(id)
}

export const changePassword = async (model: ChangePassword): Promise<void> => {
	const user: User | undefined = await getUserById(model.id)
	if (!user || (user && !(await validatePassword(model.oldPassword, user.password)))) {
		throw new Error('401')
	}
	const hash: string = await bcrypt.hash(model.newPassword, 10)
	await updateUser({
		id: user.id,
		login: user.login,
		password: hash
	})
}

export const validatePassword = async (password: string, encryptedPassword: string): Promise<boolean> => await bcrypt.compare(password, encryptedPassword)
