function getEnvSafe(env, key, fallback) {
  const val = env(key);
  // env() повертає: undefined якщо змінної немає, або рядок якщо є
  // Strapi Cloud може встановлювати порожній рядок ''
  if (val === undefined || val === null || val.trim() === '') {
    return fallback;
  }
  // Видаляємо лапки якщо вони є (env іноді залишає їх)
  return val.replace(/^["']|["']$/g, '').trim();
}

/**
 * У production порожні секрети дають 500 на /admin/login без зрозумілої відповіді в браузері.
 * Дублює перевірки з Strapi Cloud → Environment variables; деталі стеку — Runtime Logs.
 */
function validateProductionSecrets(env) {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const errors = [];

  const keys = env.array('APP_KEYS');
  const keysOk =
    Array.isArray(keys) &&
    keys.length > 0 &&
    keys.some((k) => k != null && String(k).trim() !== '');
  if (!keysOk) {
    errors.push(
      'APP_KEYS: потрібен непорожній список ключів через кому (Strapi Cloud → Environment variables).'
    );
  }

  if (!getEnvSafe(env, 'ADMIN_JWT_SECRET')) {
    errors.push(
      'ADMIN_JWT_SECRET: порожній або відсутній — логін в адмінку поверне 500 (підпис JWT).'
    );
  }

  if (!getEnvSafe(env, 'API_TOKEN_SALT')) {
    errors.push('API_TOKEN_SALT: порожній або відсутній.');
  }

  if (!getEnvSafe(env, 'TRANSFER_TOKEN_SALT')) {
    errors.push('TRANSFER_TOKEN_SALT: порожній або відсутній.');
  }

  if (!getEnvSafe(env, 'JWT_SECRET')) {
    errors.push('JWT_SECRET: порожній або відсутній (плагін users-permissions).');
  }

  if (errors.length > 0) {
    throw new Error(
      '[tanu-strapi] Невалідні змінні оточення в production:\n' +
        errors.map((line) => `  - ${line}`).join('\n') +
        '\n\nЯкщо логін уже падає з 500: Strapi Cloud → Project → Logs (Runtime) під час POST /admin/login — там stack trace.'
    );
  }
}

module.exports = ({ env }) => {
  validateProductionSecrets(env);

  return {
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
  };
};
