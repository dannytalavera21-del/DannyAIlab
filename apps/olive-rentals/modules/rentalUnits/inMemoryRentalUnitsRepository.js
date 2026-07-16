const defaultOrganization = require('../../config/defaultOrganization');

const rentalUnits = [
  {
    id: 'unit-house-1-room-1',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    propertyId: 'property-house-1',
    name: 'Habitación 1',
    unitType: 'room',
    monthlyRent: 750,
    deposit: 400,
    utilitiesIncluded: false,
    maxOccupants: 2,
    status: 'available'
  },
  {
    id: 'unit-house-1-room-2',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    propertyId: 'property-house-1',
    name: 'Habitación 2',
    unitType: 'room',
    monthlyRent: 800,
    deposit: 400,
    utilitiesIncluded: false,
    maxOccupants: 2,
    status: 'occupied'
  },
  {
    id: 'unit-house-1-room-3',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    propertyId: 'property-house-1',
    name: 'Habitación 3',
    unitType: 'room',
    monthlyRent: 775,
    deposit: 400,
    utilitiesIncluded: false,
    maxOccupants: 2,
    status: 'available'
  },
  {
    id: 'unit-house-2-room-1',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    propertyId: 'property-house-2',
    name: 'Habitación 1',
    unitType: 'room',
    monthlyRent: 700,
    deposit: 350,
    utilitiesIncluded: false,
    maxOccupants: 2,
    status: 'available'
  },
  {
    id: 'unit-house-2-room-2',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    propertyId: 'property-house-2',
    name: 'Habitación 2',
    unitType: 'room',
    monthlyRent: 725,
    deposit: 350,
    utilitiesIncluded: false,
    maxOccupants: 2,
    status: 'maintenance'
  },
  {
    id: 'unit-house-2-room-3',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    propertyId: 'property-house-2',
    name: 'Habitación 3',
    unitType: 'room',
    monthlyRent: 750,
    deposit: 350,
    utilitiesIncluded: false,
    maxOccupants: 2,
    status: 'occupied'
  },
  {
    id: 'unit-house-3-full-property',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    propertyId: 'property-house-3',
    name: 'Casa completa',
    unitType: 'whole_property',
    monthlyRent: 2200,
    deposit: 1500,
    utilitiesIncluded: false,
    maxOccupants: 6,
    status: 'available'
  },
  {
    id: 'unit-house-4-room-1',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    propertyId: 'property-house-4',
    name: 'Habitación 1',
    unitType: 'room',
    monthlyRent: 600,
    deposit: 300,
    utilitiesIncluded: false,
    maxOccupants: 2,
    status: 'available'
  },
  {
    id: 'unit-other-org-room-1',
    organizationId: 'org-other',
    businessUnitId: 'business-unit-other',
    propertyId: 'property-other-1',
    name: 'Habitación otra org',
    unitType: 'room',
    monthlyRent: 500,
    deposit: 250,
    utilitiesIncluded: false,
    maxOccupants: 2,
    status: 'available'
  }
];

function getRentalUnitsByOrganization(organizationId) {
  return rentalUnits.filter(unit => unit.organizationId === organizationId);
}

function getRentalUnitsByPropertyId(organizationId, propertyId) {
  return rentalUnits.filter(
    unit => unit.organizationId === organizationId && unit.propertyId === propertyId
  );
}

module.exports = {
  getRentalUnitsByOrganization,
  getRentalUnitsByPropertyId
};
