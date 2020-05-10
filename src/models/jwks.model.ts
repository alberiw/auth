export interface Jwks {
	readonly keys: Jwk[]
}

export interface Jwk {
	readonly kid: string
	readonly use: string
	readonly alg: string
	readonly kty: string
	readonly n: string
	readonly e: string
}
