const availabilityConversation = require('./availabilityConversation');

module.exports = {
  id: 'availability',
  menuOption: '1',
  handleInitial: availabilityConversation.handleInitial,
  handlePropertySelection: availabilityConversation.handlePropertySelection,
  handleUnitSelection: availabilityConversation.handleUnitSelection,
  handleUnitConfirmation: availabilityConversation.handleUnitConfirmation
};
