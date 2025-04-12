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

// Render inventory management page
const showInventoryManagementView = (req, res) => {
    try {
        const message = req.flash("info"); // Flash any success/failure messages
        res.render("inventory/management", {
            title: "Inventory Management",
            message,
            errors: null, // Placeholder for potential errors
        });
    } catch (error) {
        console.error("Error rendering inventory management page:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Render add classification page
const showAddClassificationForm = (req, res) => {
    res.render('inventory/classification', {
        title: "Add Classification",
        errors: [],
        message: req.flash('info'),
    });
};

// Process adding a new classification
const processAddClassification = async (req, res) => {
    const { classification_name } = req.body;

    if (!/^[a-zA-Z0-9]+$/.test(classification_name)) {
        return res.render('inventory/classification', {
            title: "Add Classification",
            errors: ['Classification name must not contain spaces or special characters.'],
            message: req.flash('info'),
        });
    }

    try {
        console.log("Adding classification:", classification_name);
        await inventoryModel.addClassification(classification_name);
        req.flash('info', 'New classification added successfully!');
        res.redirect('/inventory'); // Corrected route for redirection
    } catch (error) {
        console.error("Error adding classification:", error);
        res.render('inventory/classification', {
            title: "Add Classification",
            errors: ['Database error. Please try again.'],
        });
    }
};

// Render add inventory page
const showAddInventoryForm = async (req, res) => {
    try {
        console.log("Rendering Add Inventory page...");

        const classificationList = await utilities.buildClassificationList();
        console.log("Classifications fetched:", classificationList);

        if (!Array.isArray(classificationList) || classificationList.length === 0) {
            console.warn("No classifications found.");
            return res.render('inventory/add-inventory', {
                title: "Add Inventory Item",
                classificationList: [],
                errors: ['No classifications available. Please add classifications first.'],
                inv_make: '',
                inv_model: '',
                inv_price: '',
                inv_miles: '',
                inv_thumbnail: '',
            });
        }

        res.render('inventory/add-inventory', {
            title: "Add Inventory Item",
            classificationList,
            errors: [],
            inv_make: '',
            inv_model: '',
            inv_price: '',
            inv_miles: '',
            inv_thumbnail: '',
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
            title: "Add Inventory Item",
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
        res.redirect('/inventory'); // Corrected route for redirection
    } catch (error) {
        console.error("Error adding inventory item:", error);
        res.render('inventory/add-inventory', {
            title: "Add Inventory Item",
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
    showInventoryManagementView, // Updated naming for clarity
    showAddClassificationForm,   // Updated naming for consistency
    processAddClassification,
    showAddInventoryForm,        // Updated naming for consistency
    processAddInventory,
};
