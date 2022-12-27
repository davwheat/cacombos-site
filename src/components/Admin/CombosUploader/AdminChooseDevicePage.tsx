import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import DevicesList from '@components/DevicesList/DevicesList';
import DevicesListItem from '@components/DevicesList/DevicesListItem';
import Breadcrumbs from '@components/Design/Breadcrumbs';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';

export interface AdminChooseDevicePageProps extends RouteComponentProps {}

export default function AdminChooseDevicePage({}: AdminChooseDevicePageProps) {
  return (
    <>
      <Hero firstElement>
        <h1 className="text-shout">Upload combos: select device</h1>
      </Hero>

      <Breadcrumbs
        data={[
          {
            t: 'Home',
            url: `/`,
          },
          {
            t: 'Admin',
            url: `/admin`,
          },
          {
            t: 'Upload',
            url: `/admin/upload`,
          },
        ]}
      />

      <Section width="full" css={{ padding: '0 32px' }}>
        <DevicesList
          pageSize={100}
          itemComponent={(props) => <DevicesListItem uriGenerator={(device) => `/admin/upload/${device.uuid()}`} {...props} />}
        />
      </Section>
    </>
  );
}
