const rentalUnitsRepository = require('./inMemoryRentalUnitsRepository');

function getRentalUnitsByOrganizationId(organizationId) {
  return rentalUnitsRepository.getRentalUnitsByOrganization(organizationId);
}

function getRentalUnitsByPropertyId(organizationId, propertyId) {
  return rentalUnitsRepository.getRentalUnitsByPropertyId(organizationId, propertyId);
}

module.exports = {
  getRentalUnitsByOrganizationId,
  getRentalUnitsByPropertyId
};
