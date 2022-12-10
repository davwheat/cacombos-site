import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Section from '@components/Design/Section';
import DevicesList from '@components/DevicesList/DevicesList';
import Hero from '@components/Design/Hero';

import type { HeadFC, PageProps } from 'gatsby';

export default function AllDevicesPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">All devices</h1>
      </Hero>

      <Section>
        <DevicesList />
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="All devices"></SEO>;
