import { useEffect } from 'react';

import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import CardLink from '@components/Links/CardLink';
import Link from '@components/Links/Link';
import DeviceFirmware from '@api/Models/DeviceFirmware';
import { useLoadDevice } from '@hooks/useLoadDevice';
import { navigate } from 'gatsby';
import { useSnackbar } from 'notistack';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';

export interface AdminChooseDevicePageProps extends RouteComponentProps {
  deviceUuid?: string;
}

export default function AdminChooseFirmwarePage({ deviceUuid }: AdminChooseDevicePageProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { device, loadingState, error } = useLoadDevice(deviceUuid ?? '', ['modem', 'deviceFirmwares', 'deviceFirmwares.capabilitySets']);

  useEffect(() => {
    if (!deviceUuid) {
      navigate(`/admin/upload`);
      return;
    }
  }, []);

  useEffect(() => {
    if (loadingState === 'error') {
      enqueueSnackbar('Error loading device data from server', { variant: 'error' });
      navigate(`/admin/upload`);
    }
  }, [loadingState]);

  return (
    <>
      <Hero firstElement>
        <h1 className="text-shout">Upload combos: select firmware</h1>
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
            t: 'Upload',
            url: `/admin/upload`,
          },
          {
            t: device?.deviceName() ?? 'Loading device...',
            url: `/admin/upload/${deviceUuid}`,
          },
        ]}
      />

      <Section>
        <ul css={{ listStyle: 'none' }}>
          {device?.deviceFirmwares() &&
            (device.deviceFirmwares() as DeviceFirmware[]).map((fw) => (
              <li key={fw.uuid()}>
                <CardLink to={`/admin/upload/${deviceUuid}/${fw.uuid()}`}>
                  <h3 className="text-loud" css={{ marginBottom: 0 }}>
                    {fw.name()}
                  </h3>
                </CardLink>
              </li>
            ))}

          {device?.deviceFirmwares() && (device.deviceFirmwares() as DeviceFirmware[])?.length === 0 && (
            <p className="text-speak">
              There appears to be no firmwares for this device. You might need to{' '}
              <Link href={`/admin/devices/edit/${deviceUuid}`}>create one first</Link>.
            </p>
          )}
        </ul>
      </Section>
    </>
  );
}
