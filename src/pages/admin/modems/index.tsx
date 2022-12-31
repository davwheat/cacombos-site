import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Hero from '@components/Design/Hero';
import Section from '@components/Design/Section';
import AdminModemsList from '@components/Admin/AdminModemsList';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import Link from '@components/Links/Link';

import type { HeadFC, PageProps } from 'gatsby';

export default function AdminModemsPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">Admin &mdash; Modems</h1>
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
            t: 'Manage modems',
            url: `/admin/modems`,
          },
        ]}
      />

      <Section>
        <div css={{ marginBottom: 16 }}>
          <Link href="/admin/modems/new">Create a new modem</Link>
        </div>

        <AdminModemsList />
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Admin - Modems"></SEO>;
