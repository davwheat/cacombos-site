import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Hero from '@components/Design/Hero';
import Section from '@components/Design/Section';
import DevicesList from '@components/DevicesList/DevicesList';
import DevicesListItem from '@components/DevicesList/DevicesListItem';
import Link from '@components/Links/Link';
import Breadcrumbs from '@components/Design/Breadcrumbs';

import type { HeadFC, PageProps } from 'gatsby';

export default function AdminDevicesPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">Admin &mdash; Devices</h1>
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
            t: 'Manage devices',
            url: `/admin/devices`,
          },
        ]}
      />

      <Section>
        <div css={{ marginBottom: 16 }}>
          <Link href="/admin/devices/new">Create a new device</Link>
        </div>

        <DevicesList
          pageSize={100}
          itemComponent={(props) => <DevicesListItem uriGenerator={(device) => `/admin/devices/edit/${device.uuid()}`} {...props} />}
        />
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Admin - Devices"></SEO>;
