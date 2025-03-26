// database/connection.js

const { Pool } = require("pg")
require("dotenv").config() // Load environment variables

// PostgreSQL connection pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
})

// Check database connection
pool.connect()
  .then(client => {
    console.log("✅ Database connected successfully")
    client.release()
  })
  .catch(err => console.error("❌ Database connection error", err.stack))

module.exports = pool
