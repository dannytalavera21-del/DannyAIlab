const availabilityService = require('../modules/availability/availabilityService');
const defaultOrganization = require('../config/defaultOrganization');

describe('availabilityService', () => {
  it('should include Casa 1 Habitación 1 and Habitación 3', () => {
    const result = availabilityService.getAvailabilityByOrganizationId(defaultOrganization.organizationId);
    const casa1 = result.find(item => item.property.id === 'property-house-1');
    expect(casa1).toBeDefined();
    expect(casa1.units).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'unit-house-1-room-1', name: 'Habitación 1', monthlyRent: 750 }),
        expect.objectContaining({ id: 'unit-house-1-room-3', name: 'Habitación 3', monthlyRent: 775 })
      ])
    );
  });

  it('should not include Casa 1 Habitación 2', () => {
    const result = availabilityService.getAvailabilityByOrganizationId(defaultOrganization.organizationId);
    const casa1 = result.find(item => item.property.id === 'property-house-1');
    expect(casa1.units).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'unit-house-1-room-2' })
      ])
    );
  });

  it('should show only Casa 2 Habitación 1', () => {
    const result = availabilityService.getAvailabilityByOrganizationId(defaultOrganization.organizationId);
    const casa2 = result.find(item => item.property.id === 'property-house-2');
    expect(casa2).toBeDefined();
    expect(casa2.units).toEqual([
      expect.objectContaining({ id: 'unit-house-2-room-1', name: 'Habitación 1', monthlyRent: 700 })
    ]);
  });

  it('should show Casa 3 Casa completa', () => {
    const result = availabilityService.getAvailabilityByOrganizationId(defaultOrganization.organizationId);
    const casa3 = result.find(item => item.property.id === 'property-house-3');
    expect(casa3).toBeDefined();
    expect(casa3.units).toEqual([
      expect.objectContaining({ id: 'unit-house-3-full-property', name: 'Casa completa', monthlyRent: 2200 })
    ]);
  });

  it('should exclude unavailable units', () => {
    const result = availabilityService.getAvailabilityByOrganizationId(defaultOrganization.organizationId);
    const allUnits = result.flatMap(item => item.units.map(unit => unit.id));
    expect(allUnits).not.toContain('unit-house-1-room-2');
    expect(allUnits).not.toContain('unit-house-2-room-2');
    expect(allUnits).not.toContain('unit-house-2-room-3');
  });

  it('should filter results by organizationId', () => {
    const result = availabilityService.getAvailabilityByOrganizationId(defaultOrganization.organizationId);
    expect(result.every(item => item.property.id.startsWith('property-house-'))).toBe(true);
  });

  it('should not return properties for a different organization', () => {
    const result = availabilityService.getAvailabilityByOrganizationId('org-other');
    expect(result).toEqual([]);
  });
});
