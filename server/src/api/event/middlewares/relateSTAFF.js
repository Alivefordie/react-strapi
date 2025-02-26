"use strict";

/**
 * `relateSTAFF` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    ctx.query = {
      populate: {
        owner: { fields: ["id", "username", "usrId"] },
        scores: true,
      },
    };
    await next();
  };
};
