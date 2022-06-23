const knex = require('knex')
const parse = require("pg-connection-string").parse;
const config = require('./config')

/**
 * db: database connection to PostgreSQL using knex and pg
 */

//Parse the connection info into an object
const pgConfig = parse((config.NODE_ENV === 'test') ? config.TEST_DATABASE_URL : config.DATABASE_URL);

//Add SSL setting to set the env_var sslmode=no-verify in Heroku
pgConfig.ssl = { rejectUnauthorized: false };

//create DB connection
const db = knex({
    client: 'pg', 
    //connection: (config.NODE_ENV === 'test') ? config.TEST_DATABASE_URL : config.DATABASE_URL
    connection: pgConfig
});

module.exports = db