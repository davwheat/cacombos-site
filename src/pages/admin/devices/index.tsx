import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Section from '@components/Design/Section';
import AdminDevicesList from '@components/Admin/AdminDevicesList';

import type { HeadFC, PageProps } from 'gatsby';

export default function AdminDevicesPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Section>
        <h2 className="text-shout">Admin &mdash; Devices</h2>

        <AdminDevicesList />
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Admin - Devices"></SEO>;
