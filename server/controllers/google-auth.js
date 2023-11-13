"use strict";

const utils = require("@strapi/utils");
const { sanitize } = utils;
const { ApplicationError, ForbiddenError } = utils.errors;
const {
  GOOGLE_AUTH,
  GOOGLE_AUTH_MOBILE,
  PLUGIN_API_NAMES,
  USERS_PERMISSIONS,
  JWT,
} = require("../constants");

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  // @ts-ignore
  const userSchema = strapi.getModel(PLUGIN_API_NAMES.USER_PERMISSIONS_USER);

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = {
  // added route to verify google token and register/login user
  async connect(ctx) {
    const { access_token } = ctx.request.body;

    try {
      const user = await strapi
        .plugin(GOOGLE_AUTH_MOBILE)
        .service(GOOGLE_AUTH)
        .connect(access_token);

      if (user.blocked) {
        throw new ForbiddenError(
          "Your account has been blocked by an administrator"
        );
      }

      return ctx.send({
        jwt: strapi
          .plugin(USERS_PERMISSIONS)
          .service(JWT)
          .issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  },
};
