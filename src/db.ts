import Knex from 'knex'

export const config = {
	client: 'pg',
	connection: {
		host: process.env.POSTGRES_HOST || 'localhost',
		user: process.env.POSTGRES_USER || 'postgres',
		password: process.env.POSTGRES_PASSWORD || 'postgres',
		database: process.env.POSTGRES_DB || 'repl',
		port: parseInt(process.env.POSTGRES_PORT) || 5432
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: './src/migrations'
	}
}

const instance: Knex = Knex(config as Knex.Config)

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
