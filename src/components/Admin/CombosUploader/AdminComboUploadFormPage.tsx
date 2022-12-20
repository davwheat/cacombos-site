import { useCallback, useEffect, useRef, useState } from 'react';

import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import { useApiStore } from '@api/ApiStoreProvider';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';
import type Device from '@api/Models/Device';
import { navigate } from 'gatsby';
import DeviceFirmware from '@api/Models/DeviceFirmware';
import CardLink from '@components/Links/CardLink';
import CapabilitySet from '@api/Models/CapabilitySet';
import dayjs from 'dayjs';
import Link from '@components/Links/Link';
import ButtonLink from '@components/Links/ButtonLink';
import { useSnackbar } from 'notistack';
import AdminAuthDetailsEntry from '../AdminAuthDetailsEntry';
import { useRecoilValue } from 'recoil';
import AdminAuthDetailsAtom from '@atoms/AdminAuthDetailsAtom';
import { useLoadDevice } from '@hooks/useLoadDevice';

export interface AdminComboUploadFormPageProps extends RouteComponentProps {
  deviceUuid?: string;
  firmwareUuid?: string;
  capSetUuid?: string;
}

export default function AdminComboUploadFormPage({ deviceUuid, firmwareUuid, capSetUuid }: AdminComboUploadFormPageProps) {
  const store = useApiStore();
  const adminAuthDetails = useRecoilValue(AdminAuthDetailsAtom);
  const { enqueueSnackbar } = useSnackbar();

  const { device, loadingState, error } = useLoadDevice(deviceUuid ?? '', ['modem', 'deviceFirmwares', 'deviceFirmwares.capabilitySets']);
  const firmware = store.getFirstBy<DeviceFirmware>('device-firmwares', 'uuid', firmwareUuid ?? '');
  const capSet = store.getFirstBy<CapabilitySet>('capability-sets', 'uuid', capSetUuid ?? '');

  const isValidFw = device && firmware && (device?.deviceFirmwares() || []).some((fw) => fw?.uuid() === firmware.uuid());
  const isValidCapSet = isValidFw && capSet && (firmware?.capabilitySets() || []).some((cs) => cs?.uuid() === capSet.uuid());

  useEffect(() => {
    if (!firmwareUuid) {
      if (!deviceUuid) {
        navigate(`/admin/upload`);
        return;
      }

      navigate(`/admin/upload/${deviceUuid}`);
      return;
    }
  }, []);

  useEffect(() => {
    if (loadingState === 'error') {
      enqueueSnackbar('Error loading device data from server', { variant: 'error' });
      navigate(`/admin/upload`);
    }
  }, [loadingState]);

  useEffect(() => {
    if (loadingState === 'loaded') {
      if (!isValidFw) {
        navigate(`/admin/upload/${deviceUuid}`);
        return;
      }

      if (!isValidCapSet) {
        navigate(`/admin/upload/${deviceUuid}/${firmwareUuid}`);
        return;
      }
    }
  }, [isValidCapSet, isValidFw, loadingState, deviceUuid, firmwareUuid]);

  return (
    <>
      <Hero firstElement>
        <h1 className="text-shout">Upload combos to capability set</h1>
      </Hero>

      <Breadcrumbs
        data={[
          {
            t: 'Admin',
            url: `/admin`,
          },
          {
            t: 'Upload',
            url: `/admin/upload`,
          },
          {
            t: device?.deviceName() ?? 'Loading device...',
            url: `/admin/upload/${deviceUuid}`,
          },
          {
            t: firmware?.name() ?? 'Loading device...',
            url: `/admin/upload/${deviceUuid}/${firmwareUuid}`,
          },
          {
            t: capSet?.description() ?? 'Loading device...',
            url: `/admin/upload/${deviceUuid}/${firmwareUuid}/${capSetUuid}`,
          },
        ]}
      />

      <AdminAuthDetailsEntry sectionProps={{ darker: false }} />

      <Section width="full" css={{ padding: '0 16px' }}>
        <div css={{ maxWidth: 720, margin: 'auto' }}>
          <h2 className="text-louder">Upload form</h2>
          <p className="text-speak">
            You should only overwrite combos in an existing capability set if an import has failed. It's likely you should really be creating a new
            device firmware and/or a new capability set instead.
          </p>
          <p className="text-speak-up">To delete a capability set, you must have an admin-level token, or greater.</p>
        </div>
      </Section>
    </>
  );
}
