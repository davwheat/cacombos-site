import Layout from '@components/Design/Layout';
import EditModemPage from '@components/Admin/EditModemPage';
import Redirect from '@components/Routeing/Redirect';
import { SEO } from '@components/SEO';
import { Router } from '@gatsbyjs/reach-router';

import type { HeadProps, PageProps } from 'gatsby';

export default function EditDeviceRouterPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Router basepath="/admin/modems/edit">
        <EditModemPage path="/:uuid" />
        <Redirect path="/" to="/admin/modems" />
      </Router>
    </Layout>
  );
}

export function Head(props: HeadProps) {
  return (
    <SEO pageName="Loading modem...">
      {/* This tag is edited through a `useEffect` call within the ModemPage component. */}
      <meta id="modem-combos-robots-tag" name="robots" content="all" />
    </SEO>
  );
}
