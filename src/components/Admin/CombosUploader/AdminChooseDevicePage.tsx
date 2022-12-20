import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import DevicesList from '@components/DevicesList/DevicesList';
import DevicesListItem from '@components/DevicesList/DevicesListItem';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';

export interface AdminChooseDevicePageProps extends RouteComponentProps {}

export default function AdminChooseDevicePage({}: AdminChooseDevicePageProps) {
  return (
    <>
      <Hero firstElement>
        <h1 className="text-shout">Upload combos: select device</h1>
      </Hero>

      <Section width="full" css={{ padding: '0 32px' }}>
        <DevicesList
          pageSize={100}
          itemComponent={(props) => <DevicesListItem uriGenerator={(device) => `/admin/upload/${device.uuid()}`} {...props} />}
        />
      </Section>
    </>
  );
}
