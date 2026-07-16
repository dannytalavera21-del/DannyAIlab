const environment = require('../../config/environment');

const integrations = [
  {
    integrationId: 'wa-default-rentals',
    organizationId: environment.defaultContext.organizationId,
    businessUnitId: environment.defaultContext.businessUnitId,
    productId: environment.defaultContext.productId,
    receivingPhoneNumberId: environment.meta.phoneNumberId,
    status: 'active'
  }
];

function findByReceivingPhoneNumberId(phoneNumberId) {
  return integrations.find(
    integration => integration.receivingPhoneNumberId === phoneNumberId
  );
}

module.exports = {
  findByReceivingPhoneNumberId
};
