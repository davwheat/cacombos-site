import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import DevicesList from '@components/DevicesList/DevicesList';
import DevicesListItem from '@components/DevicesList/DevicesListItem';

import type { HeadFC, PageProps } from 'gatsby';

export default function AllDevicesPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">All devices</h1>
      </Hero>

      <Section width="full" css={{ padding: '0 32px' }}>
        <DevicesList
          allowSearch
          allowSort
          pageSize={20}
          itemComponent={(props) => <DevicesListItem uriGenerator={(device) => `/devices/${device.uuid()}`} {...props} />}
        />
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="All devices"></SEO>;
