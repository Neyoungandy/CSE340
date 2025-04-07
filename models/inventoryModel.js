const db = require('../database/connection'); // Your existing database connection file
const pool = require('../database/db'); // The additional database connection as mentioned

// Fetch a vehicle by ID
const getVehicleById = async (inventory_id) => {
    try {
        const sql = 'SELECT * FROM inventory WHERE inventory_id = $1';
        const result = await db.query(sql, [inventory_id]);
        return result.rows[0];
    } catch (error) {
        throw new Error("Database error: Unable to fetch vehicle details");
    }
};

// Add a new classification
const addClassification = async (classification_name) => {
    try {
        const query = `INSERT INTO classification (classification_name) VALUES ($1)`;
        await pool.query(query, [classification_name]);
    } catch (error) {
        throw new Error("Database error: Unable to add classification");
    }
};

// Fetch all classifications
const getClassifications = async () => {
    try {
        const query = "SELECT * FROM classification";
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error("Database error: Unable to fetch classifications");
    }
};

// Add a new inventory item
const addInventoryItem = async (itemData) => {
    try {
        const query = `
            INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_image, inv_thumbnail)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const values = [
            itemData.classification_id,
            itemData.inv_make,
            itemData.inv_model,
            itemData.inv_year,
            itemData.inv_price,
            itemData.inv_miles,
            itemData.inv_image || '/images/no-image.png', // Default image
            itemData.inv_thumbnail || '/images/no-thumbnail.png' // Default thumbnail
        ];
        await pool.query(query, values);
    } catch (error) {
        throw new Error("Database error: Unable to add inventory item");
    }
};

// Export all functions
module.exports = {
    getVehicleById,
    addClassification,
    getClassifications,
    addInventoryItem
};
