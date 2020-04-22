const app = require('./src/app');
const { PORT } = require('./src/config')

/** 
 * Binds server to PORT and listens requests on the specified host and port.
 */
app.listen(PORT, () => {
    console.log(`Server listening at port: ${PORT}`)
})