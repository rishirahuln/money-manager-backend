var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
let connection;
let db;
const dotenv = require("dotenv").config();

async function connectDb() {
  connection = await mongoClient.connect(process.env.DB);
  db = connection.db("money_manager");
  return db;
}

async function closeConnection() {
  if (connectDb) {
    setTimeout(async () => {
      await connection.close();
    }, 10000);
  } else {
    console.log("No Connection");
  }
}

module.exports = { connectDb, db, connection, closeConnection };
