module.exports = {
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development', 
    API_KEY: process.env.API_KEY, 
    DATABASE_URL: process.env.DATABASE_URL, 
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    SALT_ROUNDS: process.env.SALT_ROUNDS, 
    DEFAULT_TOTAL_DAYS: process.env.DEFAULT_TOTAL_DAYS, 
    DEFAULT_USED_DAYS: process.env.DEFAULT_USED_DAYS,
    DEFAULT_AVAILABLE_DAYS: process.env.DEFAULT_AVAILABLE_DAYS
}