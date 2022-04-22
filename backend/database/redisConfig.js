const redis = require("redis");
var colors = require("colors/safe");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

const connectRedis = async () => {
  try {
    console.log(process.env.REDIS_URL);
    // console.log(redisClient);

    redisClient.on("error", function (err) {
      console.log(
        "Error occured while connecting or accessing redis server: " + err
      );
      throw err;
    });

    redisClient.on("connect", function () {
      colors.red("Conectada Redis!, Folder: ");
    });

    await redisClient.connect();

    await redisClient.set("key", "Data test Redis saved!!");
    console.log("Redis Connected!");
    const value = await redisClient.get("key");

    console.log(value);
  } catch (error) {
    console.log("Connect to cache Redis is failed: " + error);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

module.exports = {
  connectRedis,
  redisClient,
};
