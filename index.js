// import external modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// server port
const port = process.env.PORT || 5000;

// app declaration
const app = express();

// use some common middleware
app.use(express.json());
app.use(cors());

// mongodb configuration
const uri = `mongodb+srv://${process.env.USER_NAME_DB}:${process.env.USER_PASSWORD_DB}@cluster0.qoh5erv.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// pet world apis
app.get("/", (req, res) => {
  res.send("pet wors server is running...");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const petWorldDB = client.db("pet_world");
    const productsCollection = petWorldDB.collection("products");

    // Get all products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Get a product
    // app.get("/products/:id", async (req, res) => {
    //   const id = req.params.id;

    //   const result = await productsCollection.findOne({
    //     _id: new ObjectId(id),
    //   });
    //   res.send(result);
    // });
    // Create a product
    app.post("/products", async (req, res) => {
      const product = { ...req.body };
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    // Update a product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = { ...req.body };
      const filter = {
        _id: new ObjectId(id),
      };
      const option = { upsert: true };
      const result = await productsCollection.updateOne(
        filter,
        {
          $set: product,
        },
        option
      );
      res.send(result);
    });
    // Delete a product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch((err) => console.log(err));

app.listen(port, () =>
  console.log(`Pet world server is runnin on port: ${port}...`)
);
