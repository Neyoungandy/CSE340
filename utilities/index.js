const buildVehicleHTML = (vehicle) => {
    return `
        <div class="vehicle-detail">
            <h2>${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>
            <img src="${vehicle.image}" alt="Image of ${vehicle.make} ${vehicle.model}">
            <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
            <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
            <p><strong>Description:</strong> ${vehicle.description}</p>
        </div>
    `;
};

module.exports = { buildVehicleHTML };
