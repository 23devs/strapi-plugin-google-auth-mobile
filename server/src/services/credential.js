import { factories } from '@strapi/strapi';
import { PLUGIN_API_NAMES } from '../constants';

const { createCoreService } = factories;

export default createCoreService(PLUGIN_API_NAMES.GOOGLE_AUTH_MOBILE_CREDENTIAL, {
  async findAll() {
    const entries = await strapi.db.query(PLUGIN_API_NAMES.GOOGLE_AUTH_MOBILE_CREDENTIAL).findMany();
    return entries;
  },
});
