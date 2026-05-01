'use strict';

/**
 * Нормалізація значень з env (Strapi Cloud іноді дає лапки або пробіли).
 */
function normalizeSecret(val, fallback = undefined) {
  if (val === undefined || val === null) {
    return fallback;
  }
  const s = typeof val === 'string' ? val : String(val);
  const t = s.trim();
  if (t === '') {
    return fallback;
  }
  return t.replace(/^["']|["']$/g, '').trim();
}

module.exports = { normalizeSecret };
