/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const staticRoutes = require("./routes/static");
const errorHandler = require("./middleware/errorhandler"); // Error handling middleware

/* ***********************
 * Middleware & Routes
 *************************/
app.use(staticRoutes);
app.use(errorHandler); // Apply error handling middleware

/* ***********************
 * Server Configuration
 *************************/
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set
const HOST = process.env.HOST || "localhost"; // Default to localhost if HOST is not set

/* ***********************
 * Start Server
 *************************/
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
