import Layout from '@components/Design/Layout';
import DevicePage from '@components/DevicePage/DevicePage';
import Redirect from '@components/Routeing/Redirect';
import { SEO } from '@components/SEO';
import { Router } from '@gatsbyjs/reach-router';

import type { HeadProps, PageProps } from 'gatsby';

export default function AnyDevicePage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Router basepath="/devices">
        <DevicePage path="/:uuid" />
        <Redirect path="/" to="/" />
      </Router>
    </Layout>
  );
}

export function Head(props: HeadProps) {
  return (
    <SEO pageName="Loading device...">
      {/* This tag is edited through a `useEffect` call within the DevicePage component. */}
      <meta id="device-combos-robots-tag" name="robots" content="all" />
    </SEO>
  );
}
