const conversationEngine = require('../core/conversation/conversationEngine');
const sessionStore = require('../core/conversation/sessionStore');

const baseMessage = {
  organizationId: 'org-daniel-rentals',
  businessUnitId: 'business-unit-main',
  productId: 'olive-rentals',
  contactExternalId: '5511999999999'
};

describe('conversationEngine', () => {
  beforeEach(() => {
    sessionStore.delete(baseMessage);
  });

  it('should return the menu for hola', () => {
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: 'hola' });
    expect(response.text).toContain('Olive Rentals');
    expect(response.nextState).toBe('MAIN_MENU');
  });

  it('should return the menu for unknown text without session', () => {
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: 'qué tal' });
    expect(response.text).toContain('Olive Rentals');
    expect(response.nextState).toBe('MAIN_MENU');
  });

  it('should start availability flow with option 1', () => {
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    expect(response.text).toContain('Propiedades con disponibilidad');
    expect(response.nextState).toBe('AVAILABILITY_WAITING_PROPERTY');
    expect(sessionStore.get(baseMessage).state).toBe('AVAILABILITY_WAITING_PROPERTY');
  });

  it('should select a valid property and move to unit selection', () => {
    conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    expect(response.text).toContain('Habitación 1');
    expect(response.nextState).toBe('AVAILABILITY_WAITING_UNIT');
    expect(sessionStore.get(baseMessage).state).toBe('AVAILABILITY_WAITING_UNIT');
    expect(sessionStore.get(baseMessage).selectedPropertyId).toBeDefined();
  });

  it('should reject invalid property selection', () => {
    conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '99' });
    expect(response.text).toContain('Selecciona una propiedad válida');
    expect(response.nextState).toBe('AVAILABILITY_WAITING_PROPERTY');
  });

  it('should select a valid unit and save selectedRentalUnitId', () => {
    conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    expect(response.text).toContain('Seleccionaste:');
    expect(response.nextState).toBe('AVAILABILITY_UNIT_SELECTED');
    expect(sessionStore.get(baseMessage).selectedRentalUnitId).toBeDefined();
  });

  it('should reject invalid unit selection', () => {
    conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '99' });
    expect(response.text).toContain('Selecciona una unidad válida');
    expect(response.nextState).toBe('AVAILABILITY_WAITING_UNIT');
  });

  it('should reset session on menú command', () => {
    conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: 'menú' });
    expect(response.text).toContain('Olive Rentals');
    expect(sessionStore.get(baseMessage)).toBeNull();
  });

  it('should reset session on cancelar command', () => {
    conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '1' });
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: 'cancelar' });
    expect(response.text).toContain('La operación fue cancelada.');
    expect(sessionStore.get(baseMessage)).toBeNull();
  });

  it('should return temporary message for option 2', () => {
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'text', text: '2' });
    expect(response.text).toContain('Esta función estará disponible en una siguiente etapa.');
    expect(response.nextState).toBe('MAIN_MENU');
  });

  it('should return help for non-text message', () => {
    const response = conversationEngine.handleMessage({ ...baseMessage, type: 'image', text: null });
    expect(response.text).toContain('Por el momento puedo procesar mensajes de texto.');
    expect(response.nextState).toBe('MAIN_MENU');
  });
});
