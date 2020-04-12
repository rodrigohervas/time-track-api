const db = require('./../../knexContext')
const xss = require('xss')
const bcrypt = require('bcrypt')
const config = require('./../../config')
const logger = require('./../../logger')

const saltRounds = config.SALT_ROUNDS
const usersTable = 'users'
const companiesTable = 'companies'
const serializeUsers = (user) => (
    {
        id: user.id, 
        username: xss(user.username), 
        password: xss(user.password), 
        role_id: user.role_id,
        company_id: user.company_id
    }
)

const validate = (user) => {
    for (const [key, value] of Object.entries(user)) {
        if(!value) {
            throw ( {message: `${key} is mandatory`, status: 400} )
        }
    }
}

const UsersService = {

    All(req, res, next){
        try {
            const method = req.method
            const id = req.params.id
            const verbs = ['GET', 'PUT', 'PATCH', 'DELETE']

            if( verbs.includes(method) && isNaN(id) ) {
                throw( {message: 'id is mandatory and must be a valid number', status: 400 } )
            }

            next()
        } 
        catch (error) {
            next ({ 
                message: error.message, 
                status: error.status, 
                loc: 'at users.service.All', 
                internalMessage: error.message
            })
        }
    },

    getAll(req, res, next) {
        try {
            return db
                    .select('*')
                    .from(usersTable)
                    .then( users => {
                        res.status(200).json(users.map(user => serializeUsers(user)))
                    })
                    .catch( error => {
                        logger.error(`${error.message} at users.service.getAll`)
                        next({ message: error.message, status: error.status})
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting users', 
                status: error.status, 
                loc: 'at users.service.getAll', 
                internalMessage: error.message
            })
        }
    },

    post(req, res, next) {
        try{
            const { username, password, role_id, company } = req.body

            insertCompany(next, company)
            .then(company => {
                
                bcrypt.hash(password, parseInt(saltRounds))
                        .then( hash => {
                            const user = {
                                username: username, 
                                password: hash, 
                                role_id: role_id,
                                company_id: company.id
                            }

                            validate(user)

                            return db
                                .insert(user)
                                .into(usersTable)
                                .returning('*')
                                .then(users => {
                                    const user = users[0]
                                    res.status(201).json(serializeUsers(user))
                                })
                                .catch(error => {
                                    next( { message: error.message, status: error.status } )
                                })
                        })
                        .catch(error => {
                            logger.error(`${error.message} at users.service.post`)
                            next( { message: error.message, status: error.status } )
                        })
            })
            .catch(error => {
                logger.error(`${error.message} at users.service.post`)
                next( { message: error.message, status: error.status } )
            })
                }
                catch(error) {
                    next({
                        message: 'error creating user', 
                        status: error.status, 
                        loc: 'at users.service.post', 
                        internalMessage: error.message
                    })
                }
    },

    postHashSync(req, res, next) {
        try{
            const { username, password, role_id, company_id } = req.body
            const hashedPassword = bcrypt.hashSync(password, parseInt(saltRounds))
            const user = {
                username: username, 
                password: hashedPassword, 
                role_id: role_id,
                company_id: company_id
            }
            
            validate(user)

            return db
                .insert(user)
                .into(usersTable)
                .returning('*')
                .then(users => {
                    const user = users[0]
                    res.status(201).json(serializeUsers(user))
                })
                .catch(error => {
                    logger.error(`${error.message} at users.service.post`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch(error) {
            next({
                message: 'error creating user', 
                status: error.status, 
                loc: 'at users.service.post', 
                internalMessage: error.message
            })
        }
    },

    getByUsername(req, res, next) {
        try {
            const { username, password } = req.body
            
            if(!username) {
                next({message: 'username is mandatory', status: 400})
            }
            
            if(!password) {
                next({message: 'password is mandatory', status: 400})
            }
            
            return db
                .select('*')
                .from(usersTable)
                .where({
                    username: username
                })
                .first()
                .then( user => {
                    if(!user) {
                        next( {message: `User doesn't exist`, status: 404} )
                    }

                    bcrypt.compare(password, user.password)
                            .then(result => {
                                if(!result) {
                                    next({message: 'password is invalid', status: 404})
                                }
                                res.status(200).json(serializeUsers(user))
                            })
                            .catch (error => {
                                next({message: error.message, status: error.status})
                            })
                })
                .catch( error => {
                    logger.error(`${error.message} at users.service.getByUsername`)
                    next({ message: error.message, status: error.status})
                })
        }
        catch(error) {
            next({
                message: 'error getting user', 
                status: error.status, 
                loc: 'at users.service.getByUsername', 
                internalMessage: error.message
            })
        }
    },

    updateByUsername(req, res, next) { 
        try {
            const { username, password, role_id, company_id } = req.body
            
            if(!username) {
                next({message: 'username is mandatory', status: 400})
            }
            
            if(!password) {
                next({message: 'password is mandatory', status: 400})
            }

            return db
                    .select('*')
                    .from(usersTable)
                    .where({
                        username: username
                    })
                    .first()
                    .then( user => {
                        if(!user) {
                            next( {message: `User doesn't exist`, status: 404} )
                        }
                        
                        const hashedPassword = user.password

                        bcrypt.compare(password, hashedPassword)
                            .then(result => {
                                if(!result) {
                                    next({message: 'password is invalid', status: 404})
                                }                    

                                const user = {
                                    username: username, 
                                    password: hashedPassword, 
                                    role_id: role_id,
                                    company_id: company_id
                                }
                                
                                validate(user)
                                
                                return db
                                    .update(user)
                                    .from(usersTable)
                                    .where({
                                        username: user.username, 
                                        password: user.password
                                    })
                                    .returning('*')
                                    .then( users => {
                                        const user = users[0]
                                        if(!user) {
                                            throw ( {message: `User doesn't exist`, status: 404} )
                                        }
                                        //res.status(204).end()
                                        res.status(201).json(serializeUsers(user))
                                    })
                                    .catch(error => {
                                        next( { message: error.message, status: error.status } )
                                    })
                            })
                            .catch (error => {
                                logger.error(`${error.message} at users.service.putByUsername`)
                                next( { message: error.message, status: error.status } )
                            })
                    })
                    .catch( error => {
                        next( { message: error.message, status: error.status } )
                    })            
            }
            catch(error) {
                next({
                    message: 'error updating user', 
                    status: error.status, 
                    loc: 'at users.service.putByUsername', 
                    internalMessage: error.message
                })
            }
    },

    deleteByUsername(req, res, next){
        try {
            const {username, password} = req.body
            
            if(!username) {
                next({message: 'username is mandatory', status: 400})
            }
            
            if(!password) {
                next({message: 'password is mandatory', status: 400})
            }

            return db
                    .del()
                    .from(usersTable)
                    .where({
                        username: username
                    })
                    .then(result => {
                        if(!result) {
                            throw ( {message: `User doesn't exist`, status: 404} )
                        }
                        res.status(200).json(`${result} user/s deleted`)
                    })
                    .catch(error => {
                        logger.error(`${error.message} at users.service.deleteByUsername`)
                        next( { message: error.message, status: error.status } )
                    })
        }
        catch(error) {
            next({
                message: 'error deleting user', 
                status: error.status, 
                loc: 'at users.service.deleteByUsername', 
                internalMessage: error.message
            })
        }
    }
}

const insertCompany = (next, company) => {
    try {
        return db
                .insert({
                    name: company
                })
                .into(companiesTable)
                .returning('*')
                .then(companies => {
                    const company = companies[0]
                    return company
                })
                .catch(error => {
                    logger.error(`${error.message} at users.service.insertCompany`)
                    next( { message: error.message, status: error.status } )
                })
    }
    catch(error) {
        throw({
            message: 'error creating company', 
            status: error.status, 
            loc: 'at users.service.insertCompany', 
            internalMessage: error.message
        })
    }
}

module.exports = UsersService