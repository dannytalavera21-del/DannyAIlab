const environment = require('../../config/environment');

const store = new Map();

function has(messageId) {
  if (!messageId) {
    return false;
  }
  cleanup();
  return store.has(messageId);
}

function add(messageId) {
  if (!messageId) {
    return;
  }
  cleanup();
  store.set(messageId, Date.now());
}

function remove(messageId) {
  store.delete(messageId);
}

function cleanup() {
  const ttl = environment.processedMessageTtlMinutes * 60 * 1000;
  const now = Date.now();

  for (const [messageId, timestamp] of store.entries()) {
    if (now - timestamp > ttl) {
      store.delete(messageId);
    }
  }
}

module.exports = {
  has,
  add,
  delete: remove,
  cleanup
};
