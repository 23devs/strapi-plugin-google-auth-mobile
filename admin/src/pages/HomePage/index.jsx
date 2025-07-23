import { Main, ContentLayout } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { Header } from '../../components/Header';
import { SettingsBlock } from '../../components/SettingsBlock';

const HomePage = () => {
  return (
    <ContentLayout>
      <Header></Header>
      <SettingsBlock></SettingsBlock>
    </ContentLayout>
  );
};

export { HomePage };
