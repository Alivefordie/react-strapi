"use strict";

/**
 * `isOwner` middleware
 */
module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    try {
      const entryId = ctx.params.slug;
      const response = await strapi.db.query("api::event.event").findOne({
        where: { slug: { $eq: entryId } },
        populate: ["owner"],
      });
      if (response.owner?.id !== ctx.state.user.id) {
        return ctx.unauthorized(`This action is unauthorized.`);
      } else {
        return next();
      }
    } catch (err) {
      ctx.body = { error: "missing or can't find" };
    }
  };
};
