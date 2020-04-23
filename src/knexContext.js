const knex = require('knex')
const config = require('./config')

/**
 * db: database connection to PostgreSQL using knex and pg
 */
const db = knex({
    client: 'pg', 
    connection: (config.NODE_ENV === 'test') ? config.TEST_DATABASE_URL : config.DATABASE_URL
})

module.exports = db