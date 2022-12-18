import Layout from '@components/Design/Layout';
import EditDevicePage from '@components/Admin/EditDevicePage';
import AdminChooseDevicePage from '@components/Admin/CombosUploader/AdminChooseDevicePage';
import { SEO } from '@components/SEO';
import { Router } from '@gatsbyjs/reach-router';

import type { HeadProps, PageProps } from 'gatsby';
import AdminChooseFirmwarePage from '@components/Admin/CombosUploader/AdminChooseFirmwarePage';
import AdminUploadCombosPage from '@components/Admin/CombosUploader/AdminUploadCombosPage';

export default function EditDeviceRouterPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Router basepath="/admin/upload">
        <AdminChooseDevicePage path="/" />
        <AdminChooseFirmwarePage path="/:deviceUuid" />
        <AdminUploadCombosPage path="/:deviceUuid/:firmwareUuid" />
      </Router>
    </Layout>
  );
}

export function Head(props: HeadProps) {
  return (
    <SEO pageName="Upload combos">
      {/* This tag is edited through a `useEffect` call within the DevicePage component. */}
      <meta id="device-combos-robots-tag" name="robots" content="all" />
    </SEO>
  );
}
