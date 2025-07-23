import React from 'react';
import { Box } from '@strapi/design-system';
import { Layouts } from '@strapi/admin/strapi-admin';

export const Header = () => {
  return (
    <Box background="neutral100">
      <Layouts.BaseHeaderLayout
        title={'Google Authentication for Mobile Apps'}
        tag="h2"
      />
    </Box>
  );
};
