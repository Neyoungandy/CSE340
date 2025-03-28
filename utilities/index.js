exports.buildVehicleHTML = (vehicle) => {
    return `
      <div class="vehicle-detail">
        <h1>${vehicle.year} ${vehicle.make} ${vehicle.model}</h1>
        <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
        <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
        <p><strong>Color:</strong> ${vehicle.color}</p>
        <p><strong>Fuel Type:</strong> ${vehicle.fuel_type}</p>
        <p><strong>Transmission:</strong> ${vehicle.transmission}</p>
      </div>
    `;
  };
  