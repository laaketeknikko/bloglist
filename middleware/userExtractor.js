const User = require("../mongoose_models/User")
const logger = require("../utils/logger")

const userExtractor = async (request, response, next) => {
    if (!request.decodedJWTToken || !request.decodedJWTToken.id) {
        request.user = null
    }
    else {
        const user = await User.findById(request.decodedJWTToken.id)
        request.user = user
    }
    
    next()
}



module.exports = userExtractor;
