module.exports = {
  //...

  /**
   * Simple example.
   * Every monday at 1am.
   */
  "*/1 * * * *": async () => {
    const draft = await strapi.entityService.findMany("api::event.event", {
      publicationState: "preview",
      filters: {
        publishedAt: {
          $null: true,
        },
        datedeploy: {
          $lte: new Date(),
        },
      },
    });
    await Promise.all(
      draft.map((e) => {
        return strapi.entityService.update("api::event.event", e.id, {
          data: {
            publishedAt: new Date(),
          },
        });
      })
    );
  },

  //..
};
