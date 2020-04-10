module.exports = {
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development', 
    API_KEY: process.env.API_KEY, 
    DATABASE_URL: process.env.DATABASE_URL, 
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    SALT_ROUNDS: process.env.SALT_ROUNDS
}