module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/events/findbystd",
      handler: "event.findbystd",
    },
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/events/findonebystd/:slug",
      handler: "event.findonebystd",
    },
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/events/:slug",
      handler: "event.findOne",
      config: {
        middlewares: ["api::event.relate-staff", "api::event.is-owner"],
      },
    },
    {
      // Path defined with an URL parameter
      method: "PUT",
      path: "/events/:slug",
      handler: "event.update",
      config: {
        middlewares: ["api::event.relate-staff", "api::event.is-owner"],
      },
    },
    {
      // Path defined with an URL parameter
      method: "DELETE",
      path: "/events/:slug",
      handler: "event.delete",
      config: {
        middlewares: ["api::event.is-owner"],
      },
    },
    {
      // Path defined with an URL parameter
      method: "PUT",
      path: "/events/:slug/seen",
      handler: "event.seen",
    },
    {
      // Path defined with an URL parameter
      method: "PUT",
      path: "/events/:slug/noted",
      handler: "event.noted",
    },
  ],
};
