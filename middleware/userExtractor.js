const User = require("../mongoose_models/User")
const logger = require("../utils/logger")

const userExtractor = async (request, response, next) => {
    const user = await User.findById(request.decodedJWTToken.id)

    logger.info("userextractor", user)
    request.user = user
    next()
}



module.exports = userExtractor;
