const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Add product
app.post("/api/products", (req, res) => {
  const { number, name, type, quantity } = req.body;
  if (!number || !name || !type || !quantity) {
    return res.status(400).json({ error: "All fields required" });
  }

  const sql = "INSERT INTO products (number, name, type, quantity) VALUES (?, ?, ?, ?)";
  db.query(sql, [number, name, type, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product added", productId: result.insertId });
  });
});

// Get all products
app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "❌ Product deleted" });
  });
});

// Update product
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { number, name, type, quantity } = req.body;

  if (!number || !name || !type || !quantity) {
    return res.status(400).json({ error: "All fields required" });
  }

  const sql = "UPDATE products SET number = ?, name = ?, type = ?, quantity = ? WHERE id = ?";
  db.query(sql, [number, name, type, quantity, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product updated" });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on https://inventory-tracker-xi-mocha.vercel.app/));