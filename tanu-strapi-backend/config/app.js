const { join } = require('path');

module.exports = ({ env }) => ({
  autoOpen: false,
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  bodyParsers: {
    json: {
      limit: '100mb',
    },
    form: {
      limit: '100mb',
    },
  },
  plugins: {
    // Configure plugins if needed
  },
});
