const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 3000;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  tlsInsecure: true,
});


let database;

async function connectToDatabase() {
  try {
    await client.connect();
    database = client.db("nuts-ecommerce-backend");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/items", async (req, res) => {
  try {
    const collection = database.collection("products");
    const items = await collection.find({}).toArray();
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/items/add", async (req, res) => {
  try {
    const collection = database.collection("products");
    const newItem = req.body;
    const result = await collection.insertOne(newItem);
    res.json({
      message: "Product added successfully!",
      insertedID: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res
      .status(500)
      .json({ error: "Failed to create item", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
