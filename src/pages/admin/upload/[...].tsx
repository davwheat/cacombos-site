import Layout from '@components/Design/Layout';
import { SEO } from '@components/SEO';
import AdminChooseDevicePage from '@components/Admin/CombosUploader/AdminChooseDevicePage';
import AdminChooseFirmwarePage from '@components/Admin/CombosUploader/AdminChooseFirmwarePage';
import AdminChooseCapabilitySetPage from '@components/Admin/CombosUploader/AdminChooseCapabilitySetPage';
import AdminComboUploadFormPage from '@components/Admin/CombosUploader/AdminComboUploadFormPage';
import { Router } from '@gatsbyjs/reach-router';

import type { HeadProps, PageProps } from 'gatsby';

export default function EditDeviceRouterPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Router basepath="/admin/upload">
        <AdminChooseDevicePage path="/" />
        <AdminChooseFirmwarePage path="/:deviceUuid" />
        <AdminChooseCapabilitySetPage path="/:deviceUuid/:firmwareUuid" />
        <AdminComboUploadFormPage path="/:deviceUuid/:firmwareUuid/:capSetUuid" />
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
