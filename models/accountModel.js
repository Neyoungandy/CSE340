const pool = require("../database/db"); // Import the database connection pool

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password 
       FROM account 
       WHERE account_email = $1`,
      [account_email]
    );
    return result.rows[0]; // Return the account data if found
  } catch (error) {
    console.error("Error retrieving account by email:", error.message);
    throw new Error("No matching email found");
  }
}

/* *****************************
 * Return account data using account ID
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type 
       FROM account 
       WHERE account_id = $1`,
      [account_id]
    );
    return result.rows[0]; // Return the account data if found
  } catch (error) {
    console.error("Error retrieving account by ID:", error.message);
    throw new Error("No matching account ID found");
  }
}

/* ****************************************
 * Create a new account in the database
 **************************************** */
async function createAccount({ firstname, lastname, email, password }) {
  try {
    const result = await pool.query(
      `INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
       VALUES ($1, $2, $3, $4) RETURNING account_id`,
      [firstname, lastname, email, password]
    );
    return result.rowCount > 0; // Return true if the insert was successful
  } catch (error) {
    console.error("Error creating account:", error.message);
    throw error; // Ensure the error propagates to the calling function
  }
}

/* ****************************************
 * Update account information by account ID
 **************************************** */
async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const result = await pool.query(
      `UPDATE account 
       SET account_firstname = $1, account_lastname = $2, account_email = $3
       WHERE account_id = $4`,
      [firstname, lastname, email, account_id]
    );
    return result.rowCount > 0; // Return true if the update was successful
  } catch (error) {
    console.error("Error updating account information:", error.message);
    throw error; // Ensure the error propagates to the calling function
  }
}

/* ****************************************
 * Update password by account ID
 **************************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const result = await pool.query(
      `UPDATE account 
       SET account_password = $1
       WHERE account_id = $2`,
      [hashedPassword, account_id]
    );
    return result.rowCount > 0; // Return true if the password update was successful
  } catch (error) {
    console.error("Error updating password:", error.message);
    throw error; // Ensure the error propagates to the calling function
  }
}

/* ****************************************
 * Export functions for use in controllers
 **************************************** */
module.exports = {
  getAccountByEmail,
  getAccountById, // Fetch account by ID
  createAccount,
  updateAccount,   // Update account information
  updatePassword,  // Update account password
};
