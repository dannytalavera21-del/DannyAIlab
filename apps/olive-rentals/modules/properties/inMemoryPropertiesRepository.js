const defaultOrganization = require('../../config/defaultOrganization');

const properties = [
  {
    id: 'property-house-1',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    name: 'Casa 1',
    propertyType: 'house',
    rentalMode: 'by_unit',
    description: 'Casa para renta por unidad',
    status: 'active',
    address: 'Calle 1, Zona Residencial'
  },
  {
    id: 'property-house-2',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    name: 'Casa 2',
    propertyType: 'house',
    rentalMode: 'by_unit',
    description: 'Casa con varias habitaciones',
    status: 'active',
    address: 'Calle 2, Zona Residencial'
  },
  {
    id: 'property-house-3',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    name: 'Casa 3',
    propertyType: 'house',
    rentalMode: 'whole_property',
    description: 'Casa completa en renta',
    status: 'active',
    address: 'Calle 3, Zona Residencial'
  },
  {
    id: 'property-house-4',
    organizationId: defaultOrganization.organizationId,
    businessUnitId: defaultOrganization.businessUnitId,
    name: 'Casa 4',
    propertyType: 'house',
    rentalMode: 'by_unit',
    description: 'Casa inactiva',
    status: 'inactive',
    address: 'Calle 4, Zona Residencial'
  }
];

function getPropertiesByOrganization(organizationId) {
  return properties.filter(property => property.organizationId === organizationId);
}

function getPropertyById(organizationId, propertyId) {
  return properties.find(
    property => property.organizationId === organizationId && property.id === propertyId
  );
}

module.exports = {
  getPropertiesByOrganization,
  getPropertyById
};
