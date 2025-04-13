const db = require("../database/db");

// Add new feedback
const addFeedback = async (account_id, feedback_text) => {
    try {
        const sql = `
            INSERT INTO feedback (account_id, feedback_text)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await db.query(sql, [account_id, feedback_text]);
        return result.rows[0];
    } catch (error) {
        console.error("Error adding feedback:", error);
        throw new Error("Database error");
    }
};

// Retrieve all feedback entries
const getAllFeedback = async () => {
    try {
        const sql = `
            SELECT f.feedback_id, f.feedback_text, f.feedback_date, 
                   a.account_firstname, a.account_lastname
            FROM feedback f
            JOIN account a ON f.account_id = a.account_id
            ORDER BY feedback_date DESC;
        `;
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error fetching feedback:", error);
        throw new Error("Database error");
    }
};

module.exports = {
    addFeedback,
    getAllFeedback,
};
