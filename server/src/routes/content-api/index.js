export default [
  {
    method: 'POST',
    path: '/connect',
    handler: 'googleAuth.connect',
    config: {
      auth: false,
      policies: [],
    },
  },
];
