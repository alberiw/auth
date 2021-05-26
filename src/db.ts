import Knex, { Config, PgConnectionConfig, QueryBuilder, StaticConnectionConfig } from 'knex'
import { tempDb } from './temp.db'

export const config = {
	client: 'pg',
	connection: {
		host: process.env.POSTGRES_HOST || 'localhost',
		user: process.env.POSTGRES_USER || 'postgres',
		password: process.env.POSTGRES_PASSWORD || 'postgres',
		database: process.env.POSTGRES_DB || 'repl',
		port: parseInt(process.env.POSTGRES_PORT) || 5432
	} as PgConnectionConfig,
	migrations: {
		tableName: 'knex_migrations',
		directory: './src/migrations'
	}
}

const instance: Knex = Knex(config as Config)

console.log(`Will connect to jdbc:postgres://${config.connection.user}@${config.connection.host}:${config.connection.port}/${config.connection.database}`)
instance
	.raw('select 1')
	.then(() => {
		console.log(`Connected to database - OK`)
	})
	.catch((err) => {
		console.log(`Failed to connect to database: ${err}`)
		process.exit(1)
	})

export const db = (): Knex => instance

// Returns a timestamp suitable for inserting into Postgres
export const timestamp = (): string => new Date().toUTCString()

class KnexProvider {
	private static _config: Config
	private static _instance: Knex

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	static get config(): Knex.Config {
		return this._config
	}

	static async instance(): Promise<Knex> {
		if (!this._instance) {
			this._config.connection = await this.connection()
			this._instance = Knex(this._config)
		}
		return this._instance
	}

	private static connection = async (): Promise<PgConnectionConfig> => {
		let connection: PgConnectionConfig = null
		if (!process.env.POSTGRES_HOST) {
			connection = await tempDb()
		} else {
			connection = {
				host: process.env.POSTGRES_HOST,
				user: process.env.POSTGRES_USER,
				password: process.env.POSTGRES_PASSWORD,
				database: process.env.POSTGRES_DB,
				port: parseInt(process.env.POSTGRES_PORT)
			}
		}
		return connection
	}
}

export const connectionBuilder = async (): Promise<StaticConnectionConfig> => {
	let connection: PgConnectionConfig = null
	if (!process.env.POSTGRES_HOST) {
		connection = await tempDb()
	} else {
		connection = {
			host: process.env.POSTGRES_HOST,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			port: parseInt(process.env.POSTGRES_PORT)
		}
	}
	return connection
}

export const knexProvider = new KnexProvider(await connectionBuilder())

export const inTransaction = async <T>(body: (q: QueryBuilder) => T): Promise<T> => {
	const knex = knexProvider.instance
	try {
		const t = await knex.transaction()
		try {
			const result = body(knex().transacting(t))
			t.commit()
			return result
		} catch (e) {
			t.rollback()
			throw e
		}
		// It worked
	} catch (e) {
		//It failed
	}
}
