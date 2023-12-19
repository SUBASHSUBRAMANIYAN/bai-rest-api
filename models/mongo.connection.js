const mongooseDBLayer = require("mongoose");
const mongoDBConfig = require("../config/mongo.config.json");

const dbURL = mongoDBConfig.url;

mongooseDBLayer
  .connect(dbURL)
  .then(() => {
    console.log(`Mongoose DB connection opened to ${dbURL}`);
  })
  .catch((err) => {
    console.log(`Error occured while connecting MongooDB, Error: ${err}`);
  });

mongooseDBLayer.connection.on("connected", () => {
  console.log(`on.connected: Mongoose DB connection opened to ${dbURL}`);
});

mongooseDBLayer.connection.on("error", (err) => {
  console.log(`on.error: Error occured while connecting MongooDB, Error: ${err}`);
});

mongooseDBLayer.connection.on("disconnected", () => {
  console.log("on.disconnected: Mongoose connection lost...");
});

process.on("SIGINT", () => {
  mongooseDBLayer.connection.close().then(() => {
    console.log("connection.close(): Mongoose DB connection stoped...");
    process.exit(0);
  });
});

module.exports = mongooseDBLayer;
