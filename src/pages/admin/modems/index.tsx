import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Section from '@components/Design/Section';
import AdminModemsList from '@components/Admin/AdminModemsList';

import type { HeadFC, PageProps } from 'gatsby';

export default function AdminModemsPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Section>
        <h2 className="text-shout">Admin &mdash; Modems</h2>

        <AdminModemsList />
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Admin - Modems"></SEO>;
