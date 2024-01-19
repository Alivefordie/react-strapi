"use strict";

/**
 * event router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::event.event", {
  config: {
    find: {
      middlewares: ["api::event.relate-staff"],
    },
  },
});
