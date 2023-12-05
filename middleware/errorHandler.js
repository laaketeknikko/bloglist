const logger = require('../utils/logger');

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    
    if (error.name === "ValidationError") {
        return response.status(400).json({error: error.message})
    }
    else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({error: "Invalid token"})
    }
    else if (error.name === "TokenExpiredError") {
        return response.status(401).json({
            error: "Token expired"
        })
    }

    next(error)
}


module.exports = errorHandler
