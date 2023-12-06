const bcrypt = require('bcrypt');
const User = require("../mongoose_models/User");
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app')
const testData = require("./test_data")
const logger = require('../utils/logger');
const config = require("../utils/config")
const deepClone = require("deep-clone").default
const jwt = require("jsonwebtoken")


const api = supertest(app)
const salts = config.BCRYPT_SALTS



beforeEach(async () => {
    await User.deleteMany({})
    const newUserData = deepClone(testData.newUserData)

    newUserData[0].passwordHash = 
        await bcrypt.hash(newUserData[0].password, salts);
    //delete newUserData[0].password
    newUserData[1].passwordHash =
        await bcrypt.hash(newUserData[1].password, salts);
    //delete newUserData[1].password

    await User.insertMany(newUserData)
})


describe("User login tests", () => {

    test("POST to /api/login with valid username and password returns a token", async () => {

        const result = await api.post("/api/login").send({
            username: testData.newUserData[0].username,
            password: testData.newUserData[0].password
        })
        .expect(200)
        .expect("Content-Type", /json/)

        expect(result.body.token).toBeDefined()
        expect(jwt.verify(result.body.token, process.env.SECRET).username)
        .toEqual(testData.newUserData[0].username)
    })

    test("POST TO /api/login with invalid username and password returns 401",
    async () => {
        const result = await api.post("/api/login").send({
            username: "this user does not exist",
            password: "öjwecCWE234EFfwfwe432423"
        })
        .expect(401)
        .expect("Content-Type", /json/)

        expect(result.body.token).not.toBeDefined()
    })
})


afterAll(async () => {
    mongoose.connection.close()
})
