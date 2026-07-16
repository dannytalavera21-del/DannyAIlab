const propertiesRepository = require('./inMemoryPropertiesRepository');

function getPropertiesByOrganizationId(organizationId) {
  return propertiesRepository.getPropertiesByOrganization(organizationId);
}

function getPropertyById(organizationId, propertyId) {
  return propertiesRepository.getPropertyById(organizationId, propertyId);
}

module.exports = {
  getPropertiesByOrganizationId,
  getPropertyById
};
