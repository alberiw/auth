import Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable('tokens', (table: Knex.TableBuilder) => {
		table.uuid('jti').primary()
		table.string('sub').notNullable()
		table.string('typ').notNullable()
		table.integer('iat').notNullable()
		table.integer('exp').notNullable()
		table.boolean('active').notNullable()
	})
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(knex: Knex): Promise<any> {}
