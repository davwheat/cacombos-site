import { useEffect, useRef, useState } from 'react';

import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import DevicesList from '@components/DevicesList/DevicesList';
import DevicesListItem from '@components/DevicesList/DevicesListItem';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import { useApiStore } from '@api/ApiStoreProvider';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';
import type Device from '@api/Models/Device';
import { navigate } from 'gatsby';
import DeviceFirmware from '@api/Models/DeviceFirmware';
import CardLink from '@components/Links/CardLink';
import CapabilitySet from '@api/Models/CapabilitySet';
import dayjs from 'dayjs';

export interface AdminUploadCombosPageProps extends RouteComponentProps {
  deviceUuid?: string;
  firmwareUuid?: string;
}

export default function AdminUploadCombosPage({ deviceUuid, firmwareUuid }: AdminUploadCombosPageProps) {
  const store = useApiStore();
  const [device, setDevice] = useState<Device | undefined | null>(store.getFirstBy<Device>('devices', 'uuid', deviceUuid ?? ''));
  const firmware = store.getFirstBy<DeviceFirmware>('device-firmwares', 'uuid', firmwareUuid ?? '');
  const shouldLoadDevice = !device || !device.deviceFirmwares?.();
  const loadingDevice = useRef<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const isValidFw = device && firmware && (device?.deviceFirmwares() || []).some((fw) => fw?.uuid() === firmware.uuid());

  useEffect(() => {
    if (!isValidFw && !shouldLoadDevice && !loadingDevice.current) {
      navigate(`/admin/upload/${deviceUuid}`);
    }
  }, [isValidFw, shouldLoadDevice, loadingDevice]);

  useEffect(() => {
    if (!firmwareUuid) {
      if (!deviceUuid) {
        navigate(`/admin/upload`);
        return;
      }

      navigate(`/admin/upload/${deviceUuid}`);
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
        <h1 className="text-shout">Upload combos</h1>
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
        ]}
      />

      <Section>
        <ul css={{ listStyle: 'none' }}>
          {firmware?.capabilitySets() &&
            (firmware?.capabilitySets() as CapabilitySet[]).map((capSet) => (
              <li key={capSet.uuid()}>
                <CardLink to={`/admin/upload/${deviceUuid}/${capSet.uuid()}`}>
                  <h3 className="text-loud" css={{ marginBottom: 0 }}>
                    {capSet.description()}
                  </h3>

                  <dl>
                    <dt className="text-speak-up" css={{ marginTop: 8 }}>
                      PLMN
                    </dt>
                    <dd className="text-speak">{capSet.plmn() ?? 'N/A'}</dd>

                    <dt className="text-speak-up" css={{ marginTop: 8 }}>
                      Created
                    </dt>
                    <dd className="text-speak">{dayjs(capSet.createdAt()).format('YYYY-MM-DD')}</dd>
                  </dl>
                </CardLink>
              </li>
            ))}
        </ul>
      </Section>
    </>
  );
}
