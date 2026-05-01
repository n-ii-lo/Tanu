const { normalizeSecret } = require('../src/utils/env-helpers');

function getEnvSafe(env, key, fallback) {
  return normalizeSecret(env(key), fallback);
}

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  auth: {
    secret: getEnvSafe(env, 'ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: getEnvSafe(env, 'API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: getEnvSafe(env, 'TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});
