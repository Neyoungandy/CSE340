const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities/index');

// Fetch and render vehicle details
const getVehicleDetails = async (req, res, next) => {
    try {
        const { inventory_id } = req.params;
        const vehicleData = await inventoryModel.getVehicleById(inventory_id);

        if (!vehicleData) {
            return res.status(404).render('errors/404', { message: "Vehicle not found" });
        }

        const vehicleHTML = utilities.buildVehicleHTML(vehicleData);

        res.render('inventory/detail', {
            title: `${vehicleData.make} ${vehicleData.model}`,
            vehicleHTML,
        });
    } catch (error) {
        console.error("Error fetching vehicle details:", error);
        next(error);
    }
};

// Render management page
const showManagementPage = (req, res) => {
    try {
        const message = req.flash("info");
        res.render("inventory/management", { message });
    } catch (error) {
        console.error("Error rendering management page:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Render add classification page
const showAddClassification = (req, res) => {
    res.render('inventory/classification', { errors: [], message: req.flash('info') });
};

// Process adding a new classification
const processAddClassification = async (req, res) => {
    const { classification_name } = req.body;

    if (!/^[a-zA-Z0-9]+$/.test(classification_name)) {
        return res.render('inventory/classification', {
            errors: ['Classification name must not contain spaces or special characters.'],
            message: req.flash('info'),
        });
    }

    try {
        console.log("Adding classification:", classification_name);
        await inventoryModel.addClassification(classification_name);
        req.flash('info', 'New classification added successfully!');
        res.redirect('/inv/');
    } catch (error) {
        console.error("Error adding classification:", error);
        res.render('inventory/classification', {
            errors: ['Database error. Please try again.'],
        });
    }
};

// Render add inventory page
const showAddInventory = async (req, res) => {
    try {
        console.log("Rendering Add Inventory page...");

        const classificationList = await utilities.buildClassificationList();
        console.log("Classifications fetched:", classificationList);

        if (!Array.isArray(classificationList) || classificationList.length === 0) {
            console.warn("No classifications found.");
            return res.render('inventory/add-inventory', {
                classificationList: [],
                errors: ['No classifications available. Please add classifications first.'],
                inv_make: '',
                inv_model: '',
                inv_price: '',
                inv_miles: '', // Added default value
                inv_thumbnail: '', // Added default value
            });
        }

        res.render('inventory/add-inventory', {
            classificationList,
            errors: [],
            inv_make: '',
            inv_model: '',
            inv_price: '',
            inv_miles: '', // Added default value
            inv_thumbnail: '', // Added default value
        });
    } catch (error) {
        console.error("Error rendering Add Inventory page:", error.message);
        res.status(500).send("Internal Server Error");
    }
};

// Process adding a new inventory item
const processAddInventory = async (req, res) => {
    const { classification_id, inv_make, inv_model, inv_price, inv_miles, inv_thumbnail } = req.body;

    if (!classification_id || !inv_make || !inv_model || isNaN(inv_price) || parseFloat(inv_price) <= 0 || isNaN(inv_miles) || parseInt(inv_miles) <= 0) {
        return res.render('inventory/add-inventory', {
            errors: ['All fields are required. Price and mileage must be positive numbers.'],
            classificationList: await utilities.buildClassificationList(),
            inv_make,
            inv_model,
            inv_price,
            inv_miles,
            inv_thumbnail,
        });
    }

    try {
        console.log("Adding inventory item:", inv_make, inv_model, inv_price, inv_miles, inv_thumbnail);

        await inventoryModel.addInventoryItem({
            classification_id,
            inv_make,
            inv_model,
            inv_price,
            inv_miles,
            inv_thumbnail,
        });

        req.flash('info', 'New vehicle added successfully!');
        res.redirect('/inv/');
    } catch (error) {
        console.error("Error adding inventory item:", error);
        res.render('inventory/add-inventory', {
            errors: ['Database error. Please try again.'],
            classificationList: await utilities.buildClassificationList(),
            inv_make,
            inv_model,
            inv_price,
            inv_miles,
            inv_thumbnail,
        });
    }
};

// Export all controller functions
module.exports = {
    getVehicleDetails,
    showManagementPage,
    showAddClassification,
    processAddClassification,
    showAddInventory,
    processAddInventory,
};
