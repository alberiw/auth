#auth

##Usage

Start application

```
npm start
```

Build application

```
npm run build
```

Create a migration

```
knex migrate:make migration_name
```

Create db

```
sudo -u postgres psql -c "DROP DATABASE IF EXISTS repl;"
sudo -u postgres createdb repl
```

Run migrations

```
knex migrate:latest
```

Rollback:

```
knex migrate:rollback
```
