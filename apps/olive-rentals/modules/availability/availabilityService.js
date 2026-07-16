const propertiesService = require('../properties/propertiesService');
const rentalUnitsService = require('../rentalUnits/rentalUnitsService');

function getAvailabilityByOrganizationId(organizationId) {
  const properties = propertiesService.getPropertiesByOrganizationId(organizationId);

  return properties
    .filter(property => property.status === 'active')
    .map(property => {
      const rentalUnits = rentalUnitsService.getRentalUnitsByPropertyId(organizationId, property.id);
      const availableUnits = rentalUnits
        .filter(unit => unit.status === 'available')
        .map(unit => ({
          id: unit.id,
          name: unit.name,
          monthlyRent: unit.monthlyRent,
          deposit: unit.deposit,
          utilitiesIncluded: unit.utilitiesIncluded,
          maxOccupants: unit.maxOccupants
        }));

      if (availableUnits.length === 0) {
        return null;
      }

      return {
        property: {
          id: property.id,
          name: property.name,
          rentalMode: property.rentalMode
        },
        units: availableUnits
      };
    })
    .filter(Boolean);
}

module.exports = {
  getAvailabilityByOrganizationId
};
