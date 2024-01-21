"use strict";

/**
 * event controller
 */
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  async find(ctx) {
    await this.validateQuery(ctx);
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const results = await strapi.entityService.findMany("api::event.event", {
      ...sanitizedQueryParams,
      filters: { owner: ctx.state.user.id },
    });
    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults);
  },
  async findOne(ctx) {
    await this.validateQuery(ctx);
    let sanitizedQueryParams = await this.sanitizeQuery(ctx);
    console.log(sanitizedQueryParams);
    sanitizedQueryParams.populate["owner"]["select"] =
      sanitizedQueryParams.populate["owner"]["fields"];
    //sanitizedQueryParams.populate["scores"].populate["student"]["select"] =
    //  sanitizedQueryParams.populate["scores"].populate["student"]["fields"];
    const slug = ctx.params.slug;
    const entry = await strapi.db
      .query("api::event.event")
      .findOne({ where: { slug }, ...sanitizedQueryParams });
    const sanitizedResults = await this.sanitizeOutput(entry, ctx);
    return this.transformResponse(sanitizedResults);
  },
  async create(ctx) {
    await this.validateQuery(ctx);
    const response = await super.create(ctx);
    const slg = await strapi
      .service("plugin::content-manager.uid")
      .generateUIDField({
        contentTypeUID: "api::event.event",
        field: "slug",
        data: response.data.attributes,
      });
    const updated = await strapi.entityService.update(
      "api::event.event",
      response.data.id,
      {
        data: {
          owner: ctx.state.user.id,
          slug: slg,
        },
      }
    );
    const sanitizedResults = await this.sanitizeOutput(updated, ctx);
    return this.transformResponse(sanitizedResults);
  },
  async update(ctx) {
    const slug = ctx.params.slug;
    const response = await strapi.db
      .query("api::event.event")
      .findOne({ where: { slug } });
    const eventname = ctx.request["body"].data.name;
    const update = { ...response, name: eventname };
    const slg = await strapi
      .service("plugin::content-manager.uid")
      .generateUIDField({
        contentTypeUID: "api::event.event",
        field: "slug",
        data: update,
      });
    const update2 = { ...update, slug: slg };
    const entry = await strapi.entityService.update(
      "api::event.event",
      update2.id,
      {
        data: {
          ...update2,
        },
      }
    );
    const sanitizedResults = await this.sanitizeOutput(entry, ctx);
    return this.transformResponse(sanitizedResults);
  },
  async delete(ctx) {
    const slug = ctx.params.slug;
    const response = await strapi.db
      .query("api::event.event")
      .delete({ where: { slug } });
    const sanitizedResults = await this.sanitizeOutput(response, ctx);
    return this.transformResponse(sanitizedResults);
  },
  async findbystd(ctx) {
    const entries = await strapi.db.query("api::event.event").findMany({
      select: ["id", "name", "slug", "description"],
      where: {
        publishedAt: { $ne: null },
        scores: {
          student: { id: { $eq: ctx.state.user.id } },
        },
      },
    });
    const sanitizedResults = await this.sanitizeOutput(entries, ctx);
    return this.transformResponse(sanitizedResults);
  },
  async findonebystd(ctx) {
    const { slug } = ctx.request["params"];
    const entries = await strapi.db.query("api::event.event").findOne({
      select: ["id", "name", "slug", "description"],
      populate: {
        scores: {
          populate: {
            student: {
              select: ["id", "slug", "username"],
            },
          },
          where: {
            student: { id: { $eq: ctx.state.user.id } },
          },
        },
      },
      where: {
        publishedAt: { $ne: null },
        scores: {
          student: { id: { $eq: ctx.state.user.id } },
        },
        slug: slug,
      },
    });
    const sanitizedResults = await this.sanitizeOutput(entries, ctx);
    return this.transformResponse(sanitizedResults);
  },
  async seen(ctx) {
    const { slug } = ctx.request["params"];
    const response = await strapi.db.query("api::event.event").findOne({
      populate: {
        scores: {
          where: {
            student: { id: { $eq: ctx.state.user.id } },
          },
        },
      },
      where: {
        scores: {
          student: { id: { $eq: ctx.state.user.id } },
        },
        slug: slug,
      },
    });
    let allscore = await strapi.db.query("api::event.event").findOne({
      populate: {
        scores: true,
      },
      select: ["id"],
      where: {
        scores: {
          student: { id: { $eq: ctx.state.user.id } },
        },
        slug: slug,
      },
    });
    await allscore.scores.map((obj) => {
      if (obj.id === response.scores[0].id && obj.seen === null) {
        obj.seen = new Date().toISOString();
      }
    });
    await strapi.entityService.update("api::event.event", response.id, {
      data: {
        scores: allscore.scores,
      },
    });
    ctx.body = { status: "seen" };
  },
  async noted(ctx) {
    const { slug } = ctx.request["params"];
    const response = await strapi.db.query("api::event.event").findOne({
      populate: {
        scores: {
          where: {
            student: { id: { $eq: ctx.state.user.id } },
          },
        },
      },
      where: {
        scores: {
          student: { id: { $eq: ctx.state.user.id } },
        },
        slug: slug,
      },
    });
    let allscore = await strapi.db.query("api::event.event").findOne({
      populate: {
        scores: true,
      },
      select: ["id"],
      where: {
        scores: {
          student: { id: { $eq: ctx.state.user.id } },
        },
        slug: slug,
      },
    });
    await allscore.scores.map((obj) => {
      if (obj.id === response.scores[0].id && obj.noted === null) {
        obj.noted = new Date().toISOString();
      }
    });
    await strapi.entityService.update("api::event.event", response.id, {
      data: {
        scores: allscore.scores,
      },
    });
    ctx.body = { status: "noted" };
  },
}));
