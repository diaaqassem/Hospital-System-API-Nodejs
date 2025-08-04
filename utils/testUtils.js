const mongoose = require("mongoose");
const app = require("../app");
const request = require("supertest");
const User = require("../models/User");

let testServer;

exports.setupTestServer = (port = 3000) => {
  beforeAll(async () => {
    testServer = app.listen(port);
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await testServer.close();
  });
};

exports.createTestUser = async (role = "patient") => {
  const user = await User.create({
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "password123",
    passwordConfirm: "password123",
    role,
  });

  return user;
};

exports.getAuthToken = async (user) => {
  const res = await request(app).post("/api/v1/auth/login").send({
    email: user.email,
    password: "password123",
  });

  return res.body.token;
};

exports.cleanupTestData = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
