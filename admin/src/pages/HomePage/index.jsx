// import { useIntl } from 'react-intl';
import { Layouts } from '@strapi/admin/strapi-admin';

import { Header } from '../../components/Header';
import { SettingsBlock } from '../../components/SettingsBlock';

const HomePage = () => {
  return (
    <Layouts.Content>
      <Header></Header>
      <SettingsBlock></SettingsBlock>
    </Layouts.Content>
  );
};

export { HomePage };
