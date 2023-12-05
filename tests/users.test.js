const bcrypt = require('bcrypt');
const User = require("../mongoose_models/User");
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app')
const testData = require("./test_data")
const logger = require('../utils/logger');

const api = supertest(app)


beforeEach(async () => {
    const salts = 1
    await User.deleteMany({})
    testData.newUserData[0].passwordHash = 
        await bcrypt.hash(testData.newUserData[0].password, salts);
    delete testData.newUserData[0].password
    testData.newUserData[1].passwordHash =
        await bcrypt.hash(testData.newUserData[1].password, salts);
    delete testData.newUserData[1].password

    await User.insertMany(testData.newUserData)
})

test("something happens", async () => {
    expect(true).toBe(true)
})



afterAll(async() => {
    await mongoose.connection.close()
})
