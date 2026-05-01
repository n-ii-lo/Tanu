function parseExtraOrigins(envValue) {
  if (!envValue || typeof envValue !== 'string') return [];
  return envValue
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isAllowedCorsOrigin(origin) {
  if (!origin) return true;
  let url;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  const host = url.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return true;
  if (host.endsWith('.vercel.app')) return true;
  return false;
}

module.exports = ({ env }) => {
  const extraOrigins = parseExtraOrigins(env('CORS_ORIGIN'));

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': ["'self'", 'data:', 'blob:', '*.strapiapp.com', 'res.cloudinary.com'],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: (ctx) => {
          const requestOrigin = ctx.get('Origin');
          if (!requestOrigin) return true;
          if (extraOrigins.includes(requestOrigin)) return requestOrigin;
          if (isAllowedCorsOrigin(requestOrigin)) return requestOrigin;
          return false;
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        keepHeaderOnError: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
