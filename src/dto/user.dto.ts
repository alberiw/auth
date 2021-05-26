export interface CreateUserOptionDto {
	readonly login: string
	readonly password: string
}

export interface ChangePasswordDto {
	readonly oldPassword: string
	readonly newPassword: string
}
