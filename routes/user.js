var express = require("express");
const { connectDb, closeConnection } = require("../config");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

/* User Register */
router.post("/register", async (req, res) => {
  try {
    const db = await connectDb();
    const userReg = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (!userReg) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      const user = await db.collection("users").insertOne(req.body);
      await closeConnection();
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      res.json({ token });
    } else {
      res.json({ message: "Email already registered. Please Login" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/* User Login */
router.post("/login", async function (req, res) {
  try {
    const db = await connectDb();
    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
    await closeConnection();
    if (user) {
      const compare = await bcrypt.compare(req.body.password, user.password);
      if (compare) {
        const token = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );
        res.json({ token });
      } else {
        res.json({ message: "Username/Password is incorrect" });
      }
    } else {
      res.json({ message: "Username/Password is incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
