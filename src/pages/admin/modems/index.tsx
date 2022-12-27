import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Hero from '@components/Design/Hero';
import Section from '@components/Design/Section';
import AdminModemsList from '@components/Admin/AdminModemsList';

import type { HeadFC, PageProps } from 'gatsby';

export default function AdminModemsPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">Admin &mdash; Modems</h1>
      </Hero>

      <Section>
        <AdminModemsList />
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Admin - Modems"></SEO>;
