export {}

declare global {
	namespace NodeJS {
		export interface Global {
			appRoot?: string
		}
	}
}
