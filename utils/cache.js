const redis = require("redis");
const { promisify } = require("util");
const AppError = require("./appError");

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const expireAsync = promisify(client.expire).bind(client);

exports.getFromCache = async (key) => {
  try {
    const data = await getAsync(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Cache get error:", err);
    return null;
  }
};

exports.setCache = async (key, value, ttl = 3600) => {
  try {
    await setAsync(key, JSON.stringify(value));
    await expireAsync(key, ttl);
  } catch (err) {
    console.error("Cache set error:", err);
  }
};

exports.clearCache = async (key) => {
  try {
    await delAsync(key);
  } catch (err) {
    console.error("Cache clear error:", err);
  }
};

exports.clearPattern = async (pattern) => {
  try {
    const keys = await promisify(client.keys).bind(client)(pattern);
    if (keys.length > 0) {
      await promisify(client.del).bind(client)(keys);
    }
  } catch (err) {
    console.error("Cache clear pattern error:", err);
  }
};
