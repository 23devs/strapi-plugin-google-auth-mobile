import { PLUGIN_API_NAMES, PLUGIN_ID, CREDENTIAL } from '../constants';
import { factories } from '@strapi/strapi';

const { createCoreController } = factories;

export default createCoreController(PLUGIN_API_NAMES.GOOGLE_AUTH_MOBILE_CREDENTIAL, {
  async findAll() {
    const entries = await strapi
      .plugin(PLUGIN_ID)
      .service(CREDENTIAL)
      .findAll();

    return entries;
  }
});
