"use strict";

/**
 * `isOwner` middleware
 */
module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    const slug = ctx.params.slug;
    let response = {};
    if (slug) {
      response = await strapi.db
        .query("api::event.event")
        .findOne({ where: { slug: slug }, populate: ["owner"] });
    }
    if (response) {
      if (ctx.state.user.id !== response.owner.id) {
        return ctx.unauthorized(`This action is unauthorized.`);
      } else {
        return next();
      }
    }
    return ctx.notFound("Not foundddd");
  };
};
