const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// mongodb
const uri =
  "mongodb+srv://brienaustinclayton:brien457@cluster0.evfnrk7.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// POST request for /register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const userCollection = db.collection("users");

    const existingUser = await userCollection.findOne({ username: username });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { username, password: hashedPassword };
      await userCollection.insertOne(newUser);
      res.status(200).json({ message: "Registration successful" });
    } else {
      res.status(409).json({ message: "User already exists" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
});

// POST request for /login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const userCollection = db.collection("users");

    const existingUser = await userCollection.findOne({ username: username });
    if (!existingUser) {
      res.status(404).json({ message: "Account Not Registered" });
    } else {
      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isValidPassword) {
        res.status(401).json({ error: "Invalid Password" });
      } else {
        res.status(200).json({ message: "Logged in successfully" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
});

// GET request
app.get("/", async (req, res) => {
  res.status(201).json({ message: "Successfully made GET request" });
});

// Testing POST request
app.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  res.status(200).json({
    message: `name: ${req.body.name}, email: ${req.body.email}, password: ${req.body.password}`,
  });
});

// Creating a server using express
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on Port 3000", process.env.PORT || 3000);
});
