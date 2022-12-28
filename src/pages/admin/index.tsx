import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';

import type { HeadFC, PageProps } from 'gatsby';
import Section from '@components/Design/Section';
import CardLink from '@components/Links/CardLink';
import Breakpoints from '@data/breakpoints';
import Hero from '@components/Design/Hero';
import Breadcrumbs from '@components/Design/Breadcrumbs';

export default function AdminPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">Admin dashboard</h1>
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
        ]}
      />

      <Section>
        <div
          css={[
            {
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 16,

              '& p': {
                margin: 0,
              },
            },
            {
              [Breakpoints.downTo.tablet]: {
                gridTemplateColumns: '1fr 1fr',
              },
            },
          ]}
        >
          <CardLink to="/admin/devices">
            <p className="text-loud">Manage devices</p>
          </CardLink>

          <CardLink to="/admin/modems">
            <p className="text-loud">Manage modems</p>
          </CardLink>

          <CardLink to="/admin/upload">
            <p className="text-loud">Upload combos</p>
          </CardLink>
        </div>
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Admin"></SEO>;
