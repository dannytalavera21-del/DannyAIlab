const environment = require('../../config/environment');

const sessions = new Map();

function makeKey(context) {
  return `${context.organizationId}::${context.productId}::${context.contactExternalId}`;
}

function cleanup() {
  const ttl = (Number(environment.sessionTtlMinutes) || 30) * 60 * 1000;
  const now = Date.now();

  for (const [key, session] of sessions.entries()) {
    if (!session || !session.updatedAt) {
      sessions.delete(key);
      continue;
    }

    if (now - session.updatedAt > ttl) {
      sessions.delete(key);
    }
  }
}

function get(context) {
  cleanup();
  const key = makeKey(context);
  return sessions.get(key) || null;
}

function set(context, session) {
  cleanup();
  const key = makeKey(context);
  sessions.set(key, { ...session, updatedAt: Date.now() });
}

function patch(context, partialSession) {
  cleanup();
  const key = makeKey(context);
  const current = sessions.get(key) || {};
  sessions.set(key, { ...current, ...partialSession, updatedAt: Date.now() });
}

function del(context) {
  const key = makeKey(context);
  sessions.delete(key);
}

module.exports = {
  get,
  set,
  patch,
  delete: del,
  cleanup
};
