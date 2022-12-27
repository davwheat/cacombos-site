import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import Link from '@components/Links/Link';

import type { HeadFC, PageProps } from 'gatsby';

export default function NotFoundPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">Page not found</h1>
      </Hero>
      <Section>
        <p className="text-speak-up">We couldn't find the page you're looking for.</p>
        <p className="text-speak">Maybe the page was moved, or perhaps it never existed at all.</p>

        <nav>
          <ul className="list">
            <li>
              <Link href="/">Go to the devices list</Link>
            </li>
          </ul>
        </nav>
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="404 Not Found"></SEO>;
