import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Section from '@components/Design/Section';
import DevicesList from '@components/DevicesList/DevicesList';
import DevicesListItem from '@components/DevicesList/DevicesListItem';

import type { HeadFC, PageProps } from 'gatsby';

export default function AdminDevicesPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Section>
        <h2 className="text-shout">Admin &mdash; Devices</h2>

        <DevicesList
          pageSize={100}
          itemComponent={(props) => <DevicesListItem uriGenerator={(device) => `/admin/devices/edit/${device.uuid()}`} {...props} />}
        />
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Admin - Devices"></SEO>;
