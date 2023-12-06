const config = require("./utils/config")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require('cors')

const JWTTokenExtractor = require("./middleware/JWTTokenExtractor")
const userExtractor = require("./middleware/userExtractor")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")

const mongoose = require('mongoose')
mongoose.set("strictQuery", false)
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.use(JWTTokenExtractor)
app.use(userExtractor)
app.use("/api/login", loginRouter)
app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)

const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)


module.exports = app;
