import { startPostgresContainer } from 'docker-await-postgres'
import exitHook from 'exit-hook'
import { PgConnectionConfig } from 'knex'

export const tempDb = async (config?: PgConnectionConfig): Promise<PgConnectionConfig> => {
	if (!config) {
		config = {
			user: 'test',
			password: 'test',
			database: 'test'
		}
	}
	const { stop, port } = await startPostgresContainer({ user: config.user, password: config.password, database: config.database })
	exitHook(() => {
		stop
	})
	config.host = 'localhost'
	config.port = port
	return config
}
