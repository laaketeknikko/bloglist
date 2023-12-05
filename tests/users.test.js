const bcrypt = require('bcrypt');
const User = require("../mongoose_models/User");
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app')
const testData = require("./test_data")
const logger = require('../utils/logger');
const config = require("../utils/config")
const deepClone = require("deep-clone").default

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


describe("GET to /api/users", () => {

    test("GET /api/users returns all users", async () => {
        const users = await User.find({})

        expect(users).toHaveLength(2)

        expect(users[0].username).toBe(testData.newUserData[0].username)
        expect(users[1].username).toBe(testData.newUserData[1].username)
    })
})


describe("POST to /api/users", () => {

    test("POST to /api/users creates a new user", async () => {
        const newUser = {name: "posttestuser", username: "posttest", password: "postest"}

        const result = await api.post("/api/users").send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/)

        expect(result.body.name).toBe(newUser.name)
        expect(result.body.username).toBe(newUser.username)

        const fromDatabase = await User.findOne({username: newUser.username})
        expect(fromDatabase.name).toBe(newUser.name)
        expect(fromDatabase.username).toBe(newUser.username)
    })

    test("POST to /api/users with existing username doesn't overwrite user",
    async() => {
        const newUser = deepClone(testData.newUserData[0])
        newUser.name = "Modified name"

        const result = await api.post("/api/users").send(newUser)
       .expect(400)
       .expect("Content-Type", /application\/json/)

       //const existingUser = await User.findOne({username: newUser.username})
       const existingUser = await User.findOne({username: testData.newUserData[0].username})

       expect(existingUser.name).toEqual(testData.newUserData[0].name)
    })

    test("POST to /api/users with invalid username or password doesn't save user",
    async () => {
        const newUser = deepClone(testData.newUserData[0])
        newUser.username = "f"

        const usernameResult = await api.post("/api/users").send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)

        newUser.username = "valid username"
        newUser.password = "4"

        const passwordResult = await api.post("/api/users").send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)

        const numberOfUser = await User.countDocuments()
        expect(numberOfUser).toBe(2)
    })
})



afterAll(async() => {
    await mongoose.connection.close()
})
