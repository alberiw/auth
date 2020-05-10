export interface User {
	readonly id: string
	readonly login: string
	readonly password: string
}

export interface ChangePassword {
	readonly id: string
	readonly oldPassword: string
	readonly newPassword: string
}
