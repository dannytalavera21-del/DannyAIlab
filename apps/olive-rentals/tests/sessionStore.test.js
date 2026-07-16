const sessionStore = require('../core/conversation/sessionStore');

const context = {
  organizationId: 'org-daniel-rentals',
  productId: 'olive-rentals',
  contactExternalId: '5511999999999'
};

describe('sessionStore', () => {
  beforeEach(() => {
    sessionStore.delete(context);
  });

  it('should store and retrieve a session', () => {
    sessionStore.set(context, { state: 'MAIN_MENU' });
    expect(sessionStore.get(context)).toMatchObject({ state: 'MAIN_MENU' });
  });

  it('should patch an existing session', () => {
    sessionStore.set(context, { state: 'MAIN_MENU', data: {} });
    sessionStore.patch(context, { state: 'AVAILABILITY_WAITING_PROPERTY' });
    expect(sessionStore.get(context).state).toBe('AVAILABILITY_WAITING_PROPERTY');
  });

  it('should delete a session', () => {
    sessionStore.set(context, { state: 'MAIN_MENU' });
    sessionStore.delete(context);
    expect(sessionStore.get(context)).toBeNull();
  });
});
