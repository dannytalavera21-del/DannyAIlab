const menuBuilder = require('./menuBuilder');
const sessionStore = require('./sessionStore');
const moduleRegistry = require('../modules/moduleRegistry');
const availabilityModule = require('../../modules/availability');

moduleRegistry.register(availabilityModule);

const globalCommands = {
  menu: 'MENU',
  menú: 'MENU',
  inicio: 'MENU',
  start: 'MENU',
  cancelar: 'CANCEL',
  cancel: 'CANCEL',
  ayuda: 'HELP',
  help: 'HELP'
};

function normalizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text.trim().toLowerCase();
}

function buildContext(message) {
  return {
    organizationId: message.organizationId,
    businessUnitId: message.businessUnitId,
    productId: message.productId,
    contactExternalId: message.contactExternalId
  };
}

function buildSessionContext(message) {
  return {
    organizationId: message.organizationId,
    productId: message.productId,
    contactExternalId: message.contactExternalId
  };
}

function respondWithMenu() {
  return {
    type: 'text',
    text: menuBuilder.buildMainMenu(),
    nextState: 'MAIN_MENU',
    metadata: {}
  };
}

function respondWithHelp() {
  return {
    type: 'text',
    text: menuBuilder.buildHelpMessage(),
    nextState: 'MAIN_MENU',
    metadata: {}
  };
}

function respondWithCancel() {
  return {
    type: 'text',
    text: `${menuBuilder.buildCancelMessage()}\n\n${menuBuilder.buildMainMenu()}`,
    nextState: 'MAIN_MENU',
    metadata: {}
  };
}

function handleGlobalCommand(normalized, context) {
  if (!globalCommands[normalized]) {
    return null;
  }

  const command = globalCommands[normalized];

  if (command === 'MENU') {
    sessionStore.delete(buildSessionContext(context));
    return respondWithMenu();
  }

  if (command === 'CANCEL') {
    sessionStore.delete(buildSessionContext(context));
    return respondWithCancel();
  }

  if (command === 'HELP') {
    return respondWithHelp();
  }

  return null;
}

function handleMainMenu(normalized, message, session) {
  if (normalized === '1') {
    const module = moduleRegistry.getByMenuOption('1');
    if (!module) {
      return respondWithMenu();
    }
    const result = module.handleInitial(session, message);
    sessionStore.set(buildSessionContext(message), result.session);
    return result.response;
  }

  if (['2', '3', '4', '5'].includes(normalized)) {
    return {
      type: 'text',
      text: `Esta función estará disponible en una siguiente etapa.\n\n${menuBuilder.buildMainMenu()}`,
      nextState: 'MAIN_MENU',
      metadata: {}
    };
  }

  return respondWithMenu();
}

function handleAvailabilityState(message, session) {
  const normalized = normalizeText(message.text);

  if (session.state === 'AVAILABILITY_WAITING_PROPERTY') {
    const result = moduleRegistry.getById('availability').handlePropertySelection(session, normalized);
    if (result.session) {
      sessionStore.set(buildSessionContext(message), result.session);
    }
    return result.response;
  }

  if (session.state === 'AVAILABILITY_WAITING_UNIT') {
    const result = moduleRegistry.getById('availability').handleUnitSelection(session, normalized);
    if (result.session) {
      sessionStore.set(buildSessionContext(message), result.session);
    }
    if (result.session === null) {
      sessionStore.delete(buildSessionContext(message));
      return {
        type: 'text',
        text: result.response.text || menuBuilder.buildMainMenu(),
        nextState: 'MAIN_MENU',
        metadata: {}
      };
    }
    return result.response;
  }

  if (session.state === 'AVAILABILITY_UNIT_SELECTED') {
    const result = moduleRegistry.getById('availability').handleUnitConfirmation(session, normalized);
    if (result.session === null) {
      sessionStore.delete(buildSessionContext(message));
      return {
        type: 'text',
        text: result.response.text ? `${result.response.text}\n\n${menuBuilder.buildMainMenu()}` : menuBuilder.buildMainMenu(),
        nextState: 'MAIN_MENU',
        metadata: {}
      };
    }
    sessionStore.set(buildSessionContext(message), result.session);
    return result.response;
  }

  return respondWithMenu();
}

function handleMessage(message) {
  if (!message || message.type !== 'text') {
    return {
      type: 'text',
      text: 'Por el momento puedo procesar mensajes de texto.\nEscribe “menú” para ver las opciones disponibles.',
      nextState: 'MAIN_MENU',
      metadata: {}
    };
  }

  const normalized = normalizeText(message.text);
  const context = buildContext(message);
  const session = sessionStore.get(buildSessionContext(message));

  const global = handleGlobalCommand(normalized, context);
  if (global) {
    return global;
  }

  if (!session || session.state === 'MAIN_MENU') {
    return handleMainMenu(normalized, message, session);
  }

  if (session.selectedModule === 'availability') {
    return handleAvailabilityState(message, session);
  }

  return respondWithMenu();
}

module.exports = {
  handleMessage
};
