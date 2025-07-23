import { errors } from '@strapi/utils';
import { toLower, find, isEmpty } from 'lodash';
import { OAuth2Client } from 'google-auth-library';
import { PLUGIN_API_NAMES, PLUGIN_ID, CREDENTIAL } from '../constants';

const { ApplicationError } = errors;

export default ({ strapi }) => {
  const _verifyGoogleToken = async (accessToken) => {
    const client = new OAuth2Client();
    const credentials = await strapi
      .plugin(PLUGIN_ID)
      .service(CREDENTIAL)
      .findAll();

    if (!credentials || credentials.length === 0) {
      throw new ApplicationError(
        'Client IDs were not set in plugin settings'
      );
    }

    let keys = [];

    for (let element of credentials) {
      if (element?.client_id) {
        keys.push(element.client_id);
      }
    };

    if (keys.length === 0) {
      throw new ApplicationError(
        'Client IDs were not set in plugin settings'
      );
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: keys.length === 1 ? keys[0] : [...keys],
      });

      const payload = ticket.getPayload();

      if (
        payload &&
        payload['sub'] &&
        payload['email_verified'] &&
        payload['email']
      ) {
        return {
          username: payload['name'] ? payload['name'] : payload['email'],
          email: payload['email'],
        };
      } else {
        throw new ApplicationError('Invalid google auth token');
      }
    } catch (error) {
      console.log(error.message);
      throw new ApplicationError('Invalid google auth token');
    }
  };

  const connect = async (accessToken) => {
    if (!accessToken) {
      throw new Error('No access token provided.');
    }

    const profile = await _verifyGoogleToken(accessToken);
    const email = toLower(profile.email);
    if (!email) {
      throw new Error('Email was not available.');
    }

    const users = await strapi
      .query(PLUGIN_API_NAMES.USER_PERMISSIONS_USER)
      .findMany({
        where: { email },
      });

    const advancedSettings = await strapi
      .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
      .get();

    const provider = 'google';
    const user = find(users, { provider });

    if (isEmpty(user) && !advancedSettings.allow_register) {
      throw new Error('Register action is actually not available.');
    }

    if (!isEmpty(user)) {
      return user;
    }

    if (users.length && advancedSettings.unique_email) {
      throw new Error('Email is already taken.');
    }

    const defaultRole = await strapi
      .query(PLUGIN_API_NAMES.USER_PERMISSIONS_ROLE)
      .findOne({ where: { type: advancedSettings.default_role } });

    const newUser = {
      ...profile,
      email, // overwrite with lowercased email
      provider,
      role: defaultRole.id,
      confirmed: true,
    };

    const createdUser = await strapi
      .query(PLUGIN_API_NAMES.USER_PERMISSIONS_USER)
      .create({ data: newUser });

    return createdUser;
  };

  return {
    connect,
  };
};
