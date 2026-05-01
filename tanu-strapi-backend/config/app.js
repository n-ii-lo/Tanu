// host, port, app.keys — лише в config/server.js (уникнення подвійного merge з Strapi 5).
module.exports = ({ env }) => ({
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
