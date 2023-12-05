const bcrypt = require('bcrypt');
const usersRouter = require("express").Router();
const User = require("../mongoose_models/User");
const logger = require('../utils/logger');



usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs")
    response.status(200).json(users)
})


usersRouter.post("/", async (request, response) => {
    const {username, name, password} = request.body;

    if (! await validateNewUserData({username, name, password})) {
        return response.status(400).json({
            error: "Invalid data or username taken. \
Username and password must be at least 3 characters long."})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})


const validateNewUserData = async (userData) => {
    if (!userData.username || !userData.password) {return false}
    if (userData.username.length < 3 || userData.password.length < 3) {return false}

    const userByName = await User.findOne({username: userData.username})
    if (userByName) {return false}
    
    return true
}

module.exports = usersRouter;
