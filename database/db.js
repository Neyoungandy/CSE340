const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// Use DATABASE_URL if available, otherwise fallback to individual credentials
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: { rejectUnauthorized: false }, // Add this to enable SSL for Render-hosted databases
  idleTimeoutMillis: 60000, // Keep idle connections alive for 60 seconds
  connectionTimeoutMillis: 30000, // Increase connection timeout to 30 seconds
  keepAlive: true, // Ensure connections remain active
});

// Event listener for successful connection
pool.on("connect", () => {
  console.log("✅ Connected to the PostgreSQL database");
});

// Enhanced event listener for connection errors
pool.on("error", (err) => {
  if (err.code === "ECONNRESET") {
    console.warn("Transient ECONNRESET error detected. Connection will retry...");
  } else {
    console.error("❌ Database connection error:", err.message);
  }
  console.error("🔍 Full Error Details:", err.stack);
});

// Close the pool gracefully on exit
process.on("exit", async () => {
  try {
    console.log("🛑 Closing database connection pool...");
    await pool.end();
    console.log("✅ Database connection pool closed");
  } catch (err) {
    console.error("❌ Error closing database pool:", err.message);
  }
});

// Export query function to use elsewhere in the app
module.exports = {
  query: (text, params) => pool.query(text, params),
};
