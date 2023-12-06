const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')


const getTokenFrom = (request, response, next) => {

    const authorization = request.get('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.JWTToken = authorization.replace('Bearer ', '')
        request.decodedJWTToken = jwt.verify(request.JWTToken, process.env.SECRET)
    }
    else {
        request.JWTToken = null
        request.decodedJWTToken = null
    }
    next()
}


module.exports = getTokenFrom
