const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities/index'); // Utility functions like buildClassificationList

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
        next(error); // Passes the error to the middleware
    }
};

// Render management page
const showManagementPage = (req, res) => {
    res.render('inventory/management', { message: req.flash('info') });
};

// Render add classification page
const showAddClassification = (req, res) => {
    res.render('inventory/classification', { errors: [], message: req.flash('info') });
};

// Process adding a new classification
const processAddClassification = async (req, res) => {
    const { classification_name } = req.body;

    // Server-side validation
    if (!/^[a-zA-Z0-9]+$/.test(classification_name)) {
        return res.render('inventory/classification', {
            errors: ['Classification name must not contain spaces or special characters.'],
            message: req.flash('info'),
        });
    }

    try {
        await inventoryModel.addClassification(classification_name);
        req.flash('info', 'New classification added successfully!');
        res.redirect('/inv/');
    } catch (error) {
        res.render('inventory/classification', {
            errors: ['Database error. Please try again.'],
        });
    }
};

// Render add inventory page
const showAddInventory = async (req, res) => {
    const classificationList = await utilities.buildClassificationList(); // Dynamically generate classification list
    res.render('inventory/add-inventory', {
        classificationList,
        errors: [],
        inv_make: '',
        inv_model: '',
        inv_price: '',
    });
};

// Process adding a new inventory item
const processAddInventory = async (req, res) => {
    const { classification_id, inv_make, inv_model, inv_price } = req.body;

    // Server-side validation
    if (!classification_id || !inv_make || !inv_model || !inv_price) {
        return res.render('inventory/add-inventory', {
            errors: ['All fields are required.'],
            classificationList: await utilities.buildClassificationList(),
            inv_make,
            inv_model,
            inv_price,
        });
    }

    try {
        await inventoryModel.addInventoryItem({
            classification_id,
            inv_make,
            inv_model,
            inv_price,
        });
        req.flash('info', 'New vehicle added successfully!');
        res.redirect('/inv/');
    } catch (error) {
        res.render('inventory/add-inventory', {
            errors: ['Database error. Please try again.'],
            classificationList: await utilities.buildClassificationList(),
            inv_make,
            inv_model,
            inv_price,
        });
    }
};

module.exports = {
    getVehicleDetails,
    showManagementPage,
    showAddClassification,
    processAddClassification,
    showAddInventory,
    processAddInventory,
};
