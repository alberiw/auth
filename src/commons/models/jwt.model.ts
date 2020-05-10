export interface Jwt {
	readonly jti: string
	readonly sub: string
	readonly typ: JwtType
	readonly iat: number
	readonly exp: number
}

export enum JwtType {
	ACCESS = 'ACCESS',
	REFRESH = 'REFRESH'
}
