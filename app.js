const config = require("./utils/config")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require('cors')

const blogsRouter = require("./controllers/blogs")

const mongoose = require('mongoose')



mongoose.set("strictQuery", false)
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)


app.use(cors())
app.use(express.json())

app.use("", blogsRouter)



module.exports = app;
