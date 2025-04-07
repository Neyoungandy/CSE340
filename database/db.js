const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// Use DATABASE_URL if available (common for cloud-hosted databases)
const connectionString =
  process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Configure the PostgreSQL pool
const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Needed for cloud-hosted databases
});

// Event listener for successful connection
pool.on("connect", () => {
  console.log("✅ Connected to the PostgreSQL database");
});

// Event listener for connection errors
pool.on("error", (err) => {
  console.error("❌ Database connection error:", err.message);
  console.error("🔍 Full Error Details:", err.stack);
});

// Close the pool gracefully on exit
process.on("exit", async () => {
  console.log("🛑 Closing database connection pool...");
  await pool.end();
});

// Export query function to use elsewhere in the app
module.exports = {
  query: (text, params) => pool.query(text, params),
};
