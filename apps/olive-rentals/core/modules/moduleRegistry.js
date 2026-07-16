const modules = new Map();

function register(moduleDefinition) {
  if (!moduleDefinition || !moduleDefinition.id) {
    throw new Error('Module definition must contain id');
  }
  modules.set(moduleDefinition.id, moduleDefinition);
}

function getById(id) {
  return modules.get(id) || null;
}

function getByMenuOption(option) {
  const module = Array.from(modules.values()).find(item => item.menuOption === option);
  return module || null;
}

module.exports = {
  register,
  getById,
  getByMenuOption
};
