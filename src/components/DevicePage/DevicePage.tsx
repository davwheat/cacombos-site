import React, { useEffect, useState } from 'react';

import DeviceHero from './DeviceHero';
import DeviceFirmwareComboPicker from './DeviceFirmwareComboPicker';
import CapabilitySetVisualiser from './CapabilitySetVisualiser';
import Section from '@components/Design/Section';
import Link from '@components/Links/Link';
import LoadingSpinner from '@components/LoadingSpinner';

import Device from '@api/Models/Device';
import { useApiStore } from '@api/ApiStoreProvider';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';

export const DevicePageContext = React.createContext<Device | null>(null);

export interface DevicePageProps extends RouteComponentProps {
  uuid?: string;
}

function isDeviceBasicInfoLoaded(device?: Device): boolean {
  if (!device) return false;

  if ([device.modem()].includes(false)) return false;

  return true;
}

function isDeviceFirmwareCapSetsInfoLoaded(device?: Device): boolean {
  if (isDeviceBasicInfoLoaded(device) === false) return false;

  const fws = device!.deviceFirmwares();

  if (!fws) return false;

  if (fws.some((fw) => !fw)) return false;

  const cs = fws.map((fw) => fw!.capabilitySets()).flat();

  if (cs.some((c) => !c)) return false;

  return true;
}

export default function DevicePage({ uuid }: DevicePageProps) {
  const store = useApiStore();

  const [device, setDevice] = useState<Device | undefined>(store.getFirstBy<Device>('devices', 'uuid', uuid ?? ''));
  const [isBasicDataLoading, setIsBasicDataLoading] = useState<boolean>(!isDeviceBasicInfoLoaded(device));
  const [isFirmwareCapSetDataLoading, setIsFirmwareCapSetDataLoading] = useState<boolean>(!isDeviceFirmwareCapSetsInfoLoaded(device));
  const [error, setError] = useState<null | any>(null);

  const loadFirmwareCapSetDeviceData = async () => {
    const data = await store
      .find<Device[]>('devices', {
        include: ['modem', 'deviceFirmwares', 'deviceFirmwares.capabilitySets'],
        filter: {
          uuid: uuid ?? '',
        },
        page: {
          limit: 1,
        },
      })
      .catch((err) => {
        setError(err);
      });

    setIsBasicDataLoading(false);
    setIsFirmwareCapSetDataLoading(false);
    setDevice(data?.[0]);
  };

  useEffect(() => {
    if (device) {
      document.title = `${device.manufacturer()} ${device.deviceName()} | Mobile Combos`;
    }

    if (!device && !isBasicDataLoading) {
      document.title = `No such device | Mobile Combos`;
      document.getElementById('device-combos-robots-tag')?.setAttribute('content', 'noindex');
    }
  });

  useEffect(() => {
    if (isBasicDataLoading || isFirmwareCapSetDataLoading) {
      loadFirmwareCapSetDeviceData();
    }
  }, []);

  if (error) {
    return (
      <>
        <DeviceHero error />
        <Section>
          <p className="text-speak" css={{ textAlign: 'center', marginTop: 16 }}>
            Something went wrong when fetching data for this device. Please try again later.
          </p>
        </Section>
      </>
    );
  }

  if (!device && isBasicDataLoading) {
    return (
      <DevicePageContext.Provider value={null}>
        <DeviceHero loading />
        <Section>
          <LoadingSpinner />
          <p className="text-speak" css={{ textAlign: 'center', marginTop: 16 }}>
            Just a moment...
          </p>
        </Section>
      </DevicePageContext.Provider>
    );
  }

  if (!device) {
    return (
      <DevicePageContext.Provider value={null}>
        <DeviceHero />
        <Section>
          <p className="text-speak">
            We couldn't find the device you were looking for (<code className="code">{uuid}</code>).
          </p>
          <Link href="/">Browse all devices</Link>
        </Section>
      </DevicePageContext.Provider>
    );
  }

  return (
    <DevicePageContext.Provider key={uuid} value={device}>
      <DeviceHero key={'hero_' + uuid} device={device} />

      <DeviceFirmwareComboPicker key={'fw_' + uuid} />

      <CapabilitySetVisualiser key={'combos_' + uuid} />
    </DevicePageContext.Provider>
  );
}
