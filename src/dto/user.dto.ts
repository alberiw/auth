export interface ICreateUserOptionDto {
	readonly login: string
	readonly password: string
}

export interface IChangePasswordDto {
	readonly oldPassword: string
	readonly newPassword: string
}
