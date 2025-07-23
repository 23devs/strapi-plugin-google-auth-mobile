export const PLUGIN_ID = 'google-auth-mobile';
export const USERS_PERMISSIONS = 'users-permissions';

export const CREDENTIAL = 'credential';
export const GOOGLE_AUTH = 'googleAuth';
export const ROLE = 'role';
export const USER = 'user';
export const JWT = 'jwt';

export const PLUGIN_API_NAMES = {
  GOOGLE_AUTH_MOBILE_CREDENTIAL: `plugin::${PLUGIN_ID}.${CREDENTIAL}`,
  USER_PERMISSIONS_ROLE: `plugin::${USERS_PERMISSIONS}.${ROLE}`,
  USER_PERMISSIONS_USER: `plugin::${USERS_PERMISSIONS}.${USER}`,
};
