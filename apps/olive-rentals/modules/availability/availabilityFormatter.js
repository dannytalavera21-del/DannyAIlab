const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

function formatMoney(value) {
  if (typeof value !== 'number') {
    return value;
  }
  return currencyFormatter.format(value);
}

function formatPropertyList(properties) {
  const lines = ['🏠 Propiedades con disponibilidad', ''];

  properties.forEach((property, index) => {
    lines.push(`${index + 1}. ${property.propertyName}`);
    property.units.forEach(unit => {
      lines.push(`   • ${unit.name} — ${formatMoney(unit.monthlyRent)} al mes`);
    });
    lines.push('');
  });

  lines.push('Responde con el número de la propiedad para ver más información.');
  lines.push('');
  lines.push('Escribe “menú” para regresar al inicio.');

  return lines.join('\n');
}

function formatPropertyUnits(propertyName, units) {
  const lines = [`🏠 ${propertyName}`, ''];

  units.forEach((unit, index) => {
    lines.push(`${index + 1}. ${unit.name}`);
    lines.push(`Renta: ${formatMoney(unit.monthlyRent)} al mes`);
    lines.push(`Depósito: ${formatMoney(unit.deposit)} al mes`);
    lines.push(`Servicios incluidos: ${unit.utilitiesIncluded ? 'Sí' : 'No'}`);
    lines.push(`Ocupación máxima: ${unit.maxOccupants}`);
    lines.push('');
  });

  lines.push('Responde con el número de la unidad que te interesa.');
  lines.push('');
  lines.push('La disponibilidad debe ser confirmada por administración.');
  lines.push('Escribe “menú” para regresar al inicio.');

  return lines.join('\n');
}

function formatUnitSelection(propertyName, unit) {
  const lines = [
    'Seleccionaste:',
    '',
    propertyName,
    unit.name,
    '',
    `Renta: ${formatMoney(unit.monthlyRent)} al mes`,
    `Depósito: ${formatMoney(unit.deposit)} al mes`,
    `Servicios incluidos: ${unit.utilitiesIncluded ? 'Sí' : 'No'}`,
    `Ocupación máxima: ${unit.maxOccupants}`,
    '',
    'La disponibilidad debe ser confirmada por administración.',
    '',
    '¿Deseas solicitar una visita?',
    '',
    '1. Sí',
    '2. Regresar al menú'
  ];

  return lines.join('\n');
}

module.exports = {
  formatPropertyList,
  formatPropertyUnits,
  formatUnitSelection
};
