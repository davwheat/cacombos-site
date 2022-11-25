import Layout from '@components/Design/Layout';
import EditDevicePage from '@components/Admin/EditDevicePage';
import Redirect from '@components/Routeing/Redirect';
import { SEO } from '@components/SEO';
import { Router } from '@gatsbyjs/reach-router';

import type { HeadProps, PageProps } from 'gatsby';

export default function EditDeviceRouterPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Router basepath="/admin/devices/edit">
        <EditDevicePage path="/:uuid" />
        <Redirect path="/" to="/admin/devices" />
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
