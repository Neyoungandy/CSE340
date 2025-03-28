const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// Ensure all required environment variables are set
const requiredEnvVars = ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD", "DB_PORT"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.warn(`⚠️ Warning: Missing environment variable ${envVar}`);
  }
});

// Create a new PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // Default to 5432 if not set
  max: 10, // Limit connections to avoid overwhelming the database
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Timeout if connection takes too long
});

// Event listener for successful connection
pool.on("connect", () => {
  console.log("✅ Connected to the PostgreSQL database");
});

// Event listener for connection errors
pool.on("error", (err) => {
  console.error("❌ Unexpected database connection error:", err.message);
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
