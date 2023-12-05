const logger = require('../utils/logger')

const getTokenFrom = (request, response, next) => {

    const authorization = request.get('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.JWTToken = authorization.replace('Bearer ', '')
    }
    else {
        request.JWTToken = null
    }
    next()
}


module.exports = getTokenFrom
