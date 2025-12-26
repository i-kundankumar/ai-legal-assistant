const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { connectDB } = require("../lib/db");


const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  console.log("REGISTER BODY:", req.body);
  try {
    const db = await connectDB();
    const { name, email, password, role } = req.body;

    // ✅ DEFENSIVE CHECK
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required"
      });
    }

    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashed,
      role: role || "user",
      created_at: new Date()
    };

    const result = await db.collection("users").insertOne(user);

    const token = jwt.sign(
      { id: result.insertedId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { name, email, role: user.role }
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});



router.post("/login", async (req, res) => {
  const db = await connectDB();
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: { name: user.name, email: user.email, role: user.role }
  });
});

module.exports = router;
