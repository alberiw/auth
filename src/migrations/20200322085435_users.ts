import Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
		table.uuid('id').primary()
		table.string('login').notNullable().unique()
		table.string('password').notNullable()
	})
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(knex: Knex): Promise<any> {}
