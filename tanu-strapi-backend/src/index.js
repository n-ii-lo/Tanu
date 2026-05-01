'use strict';

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    require('./utils/validate-runtime-secrets')(strapi);
    const seed = require('../data/seed');
    await seed({ strapi });
  },
};
