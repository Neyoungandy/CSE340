const db = require('../database/connection');

const getVehicleById = async (inventory_id) => {
    try {
        const sql = 'SELECT * FROM inventory WHERE inventory_id = $1';
        const result = await db.query(sql, [inventory_id]);
        return result.rows[0];
    } catch (error) {
        throw new Error("Database error: Unable to fetch vehicle details");
    }
};

const pool = require('../database/db'); // Your database connection

exports.addClassification = async (classification_name) => {
    const query = `INSERT INTO classification (classification_name) VALUES ($1)`;
    await pool.query(query, [classification_name]);
};

module.exports = { getVehicleById };
