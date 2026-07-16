const availabilityService = require('./availabilityService');
const availabilityFormatter = require('./availabilityFormatter');

function buildAvailabilitySession(organizationId) {
  const rawAvailability = availabilityService.getAvailabilityByOrganizationId(organizationId);

  const availableProperties = rawAvailability.map((item, index) => ({
    selectionNumber: index + 1,
    propertyId: item.property.id,
    propertyName: item.property.name,
    units: item.units.map(unit => ({
      id: unit.id,
      name: unit.name,
      monthlyRent: unit.monthlyRent,
      deposit: unit.deposit,
      utilitiesIncluded: unit.utilitiesIncluded,
      maxOccupants: unit.maxOccupants
    }))
  }));

  return { rawAvailability, availableProperties };
}

function handleInitial(session, context) {
  const { availableProperties } = buildAvailabilitySession(context.organizationId);

  const formatted = availabilityFormatter.formatPropertyList(
    availableProperties.map(property => ({
      propertyName: property.propertyName,
      units: property.units
    }))
  );

  return {
    response: {
      type: 'text',
      text: formatted,
      nextState: 'AVAILABILITY_WAITING_PROPERTY',
      metadata: {}
    },
    session: {
      state: 'AVAILABILITY_WAITING_PROPERTY',
      selectedModule: 'availability',
      selectedPropertyId: null,
      selectedRentalUnitId: null,
      availableProperties,
      availableUnits: null,
      data: {}
    }
  };
}

function handlePropertySelection(session, text) {
  const selectedNumber = Number(text.trim());
  const selection = session.availableProperties.find(item => item.selectionNumber === selectedNumber);

  if (!selection) {
    const formatted = availabilityFormatter.formatPropertyList(
      session.availableProperties.map(property => ({
        propertyName: property.propertyName,
        units: property.units
      }))
    );
    return {
      response: {
        type: 'text',
        text: `Selecciona una propiedad válida usando uno de los números mostrados.\n\n${formatted}`,
        nextState: 'AVAILABILITY_WAITING_PROPERTY',
        metadata: {}
      },
      session
    };
  }

  const availableUnits = selection.units.map(unit => ({
    id: unit.id,
    name: unit.name,
    monthlyRent: unit.monthlyRent,
    deposit: unit.deposit,
    utilitiesIncluded: unit.utilitiesIncluded,
    maxOccupants: unit.maxOccupants
  }));

  const responseText = availabilityFormatter.formatPropertyUnits(selection.propertyName, availableUnits);

  return {
    response: {
      type: 'text',
      text: responseText,
      nextState: 'AVAILABILITY_WAITING_UNIT',
      metadata: {}
    },
    session: {
      ...session,
      state: 'AVAILABILITY_WAITING_UNIT',
      selectedPropertyId: selection.propertyId,
      availableUnits,
      data: { propertyName: selection.propertyName }
    }
  };
}

function handleUnitSelection(session, text) {
  const selectedNumber = Number(text.trim());
  const unit = session.availableUnits && session.availableUnits[selectedNumber - 1];

  if (!unit) {
    const formatted = availabilityFormatter.formatPropertyUnits(session.data.propertyName, session.availableUnits);
    return {
      response: {
        type: 'text',
        text: `Selecciona una unidad válida usando uno de los números mostrados.\n\n${formatted}`,
        nextState: 'AVAILABILITY_WAITING_UNIT',
        metadata: {}
      },
      session
    };
  }

  const responseText = availabilityFormatter.formatUnitSelection(session.data.propertyName, unit);

  return {
    response: {
      type: 'text',
      text: responseText,
      nextState: 'AVAILABILITY_UNIT_SELECTED',
      metadata: {}
    },
    session: {
      ...session,
      state: 'AVAILABILITY_UNIT_SELECTED',
      selectedRentalUnitId: unit.id,
      selectedPropertyId: session.selectedPropertyId,
      data: { ...session.data, unitName: unit.name, unit }
    }
  };
}

function handleUnitConfirmation(session, text) {
  const selection = text.trim();

  if (selection === '1') {
    return {
      response: {
        type: 'text',
        text: `La programación de visitas se agregará en la siguiente etapa.\n\nTu selección quedó registrada temporalmente:\n${session.data.propertyName}\n${session.data.unitName}`,
        nextState: 'MAIN_MENU',
        metadata: {}
      },
      session: null
    };
  }

  if (selection === '2') {
    return {
      response: {
        type: 'text',
        text: null,
        nextState: 'MAIN_MENU',
        metadata: {}
      },
      session: null
    };
  }

  const formatted = availabilityFormatter.formatUnitSelection(session.data.propertyName, session.availableUnits);
  return {
    response: {
      type: 'text',
      text: `Selecciona una opción válida:\n1. Solicitar una visita\n2. Regresar al menú\n\n${formatted}`,
      nextState: 'AVAILABILITY_UNIT_SELECTED',
      metadata: {}
    },
    session
  };
}

module.exports = {
  handleInitial,
  handlePropertySelection,
  handleUnitSelection,
  handleUnitConfirmation
};
