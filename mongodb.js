const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";
const main = async () => {
  try {
    const client = new MongoClient(connectionURL);
    await client.connect();
    const db = client.db(databaseName);
  } catch (e) {
    console.log("Error");
  }
};

(async () => await main())();
