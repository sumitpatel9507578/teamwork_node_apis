const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Registration failed" });
    } else {
      res.json({ message: "User registered successfully" });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err || result.length === 0) {
      res.status(400).json({ message: "Invalid email or password" });
    } else {
      const user = result[0];

      const token = jwt.sign(
        { id: user.id, email: user.email },
        "mysecretkey",
        { expiresIn: "1h" },
      );

      res.json({
        message: "Login successful",
        token: token,
      });
    }
  });
});

function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token required" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, "mysecretkey", (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      req.user = decoded;
      next();
    }
  });
}

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Registration failed" });
    } else {
      res.json({ message: "User registered successfully" });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err || result.length === 0) {
      res.status(400).json({ message: "Invalid email or password" });
    } else {
      const user = result[0];

      const token = jwt.sign(
        { id: user.id, email: user.email },
        "mysecretkey",
        { expiresIn: "1h" },
      );

      res.json({
        message: "Login successful",
        token: token,
      });
    }
  });
});

function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token required" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, "mysecretkey", (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      req.user = decoded;
      next();
    }
  });
}

app.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "User verified successfully",
    user: req.user,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
