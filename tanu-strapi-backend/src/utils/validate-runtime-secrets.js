'use strict';

const { normalizeSecret } = require('./env-helpers');

/**
 * Викликати лише з bootstrap (runtime). На етапі `strapi build` секретів у процесі немає —
 * перевірка тут не ламає збірку Strapi Cloud.
 */
module.exports = function assertProductionRuntimeSecrets(strapi) {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const server = strapi.config.get('server') || {};
  const errors = [];

  const keys = server.app && server.app.keys;
  const keysOk =
    Array.isArray(keys) &&
    keys.length > 0 &&
    keys.some((k) => k != null && String(k).trim() !== '');
  if (!keysOk) {
    errors.push(
      'APP_KEYS: потрібен непорожній список ключів через кому (Strapi Cloud → Environment variables).'
    );
  }

  if (!normalizeSecret(server.auth && server.auth.secret)) {
    errors.push(
      'ADMIN_JWT_SECRET: порожній або відсутній — логін в адмінку поверне 500 (підпис JWT).'
    );
  }

  const apiSalt = server.apiToken && server.apiToken.salt;
  if (!normalizeSecret(apiSalt)) {
    errors.push('API_TOKEN_SALT: порожній або відсутній.');
  }

  const transferSalt =
    server.transfer && server.transfer.token && server.transfer.token.salt;
  if (!normalizeSecret(transferSalt)) {
    errors.push('TRANSFER_TOKEN_SALT: порожній або відсутній.');
  }

  if (!normalizeSecret(process.env.JWT_SECRET)) {
    errors.push('JWT_SECRET: порожній або відсутній (плагін users-permissions).');
  }

  if (errors.length > 0) {
    throw new Error(
      '[tanu-strapi] Невалідні змінні оточення в production:\n' +
        errors.map((line) => `  - ${line}`).join('\n') +
        '\n\nЯкщо це під час деплою — перевірте Environment variables у Strapi Cloud.\n' +
        'Якщо логін уже падає з 500: Strapi Cloud → Project → Logs (Runtime) під час POST /admin/login — там stack trace.'
    );
  }
};
