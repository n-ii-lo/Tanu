'use strict';

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    const seed = require('../data/seed');
    await seed({ strapi });
  },
};
