import { useEffect, useRef, useState } from 'react';

import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import { useApiStore } from '@api/ApiStoreProvider';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';
import type Device from '@api/Models/Device';
import { navigate } from 'gatsby';
import DeviceFirmware from '@api/Models/DeviceFirmware';
import CardLink from '@components/Links/CardLink';

export interface AdminChooseDevicePageProps extends RouteComponentProps {
  deviceUuid?: string;
}

export default function AdminChooseFirmwarePage({ deviceUuid }: AdminChooseDevicePageProps) {
  const store = useApiStore();
  const [device, setDevice] = useState<Device | undefined | null>(store.getFirstBy<Device>('devices', 'uuid', deviceUuid ?? ''));
  const shouldLoadDevice = !device || !device.deviceFirmwares?.();
  const loadingDevice = useRef<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    if (!deviceUuid) {
      navigate(`/admin/upload`);
      return;
    }

    if (shouldLoadDevice && !loadingDevice.current) {
      loadingDevice.current = true;

      store
        .find<Device[]>('devices', {
          filter: {
            uuid: deviceUuid ?? '',
          },
          include: ['deviceFirmwares', 'modem', 'deviceFirmwares.capabilitySets'],
          page: {
            limit: 1,
          },
        })
        .then((devices) => {
          if (!devices) {
            navigate(`/admin/upload`);
            return;
          }

          setDevice(devices[0]);
        })
        .catch((err) => {
          setDevice(null);
          setError(err);
        })
        .finally(() => {
          loadingDevice.current = false;
        });
    }
  }, []);

  return (
    <>
      <Hero firstElement>
        <h1 className="text-shout">Upload combos: select firmware</h1>
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
        </ul>
      </Section>
    </>
  );
}
