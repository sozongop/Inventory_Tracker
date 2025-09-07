const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",     // your Apache MySQL host
  user: "root",          // your MySQL username
  password: "",          // your MySQL password
  database: "inventory_db" // your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected...");
});

module.exports = db;