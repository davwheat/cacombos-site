import { useContext, useEffect } from 'react';
import { DevicePageContext } from './DevicePage';
import SelectDropdown from '@components/Inputs/SelectDropdown';
import Section from '@components/Design/Section';

import DeviceSettingsAtom from '@atoms/DeviceSettingsAtom';
import ComboListDisplayOptions from '@atoms/ComboListDisplayOptions';

import { useApiStore } from '@api/ApiStoreProvider';
import Breakpoints from '@data/breakpoints';
import Device from '@api/Models/Device';

import { useRecoilState } from 'recoil';
import dayjs from 'dayjs';

import type DeviceFirmware from '@api/Models/DeviceFirmware';
import type CapabilitySet from '@api/Models/CapabilitySet';
import type Store from '@api/Store';

function getCapabilitySetsForFirmware(deviceFirmwareUuid: string, store: Store): CapabilitySet[] {
  if (deviceFirmwareUuid === '' || !deviceFirmwareUuid) return [];

  const fw = store.getFirstBy<DeviceFirmware>('device-firmwares', 'uuid', deviceFirmwareUuid)!;
  const capSets = fw.capabilitySets() as CapabilitySet[];

  return capSets;
}

function isCapabilitySetIdValidChoiceForDeviceFirmware(capabilitySetUuid: string, deviceFirmwareUuid: string, store: Store) {
  const firmwares = getCapabilitySetsForFirmware(deviceFirmwareUuid, store);

  return firmwares.some((cs) => cs!.uuid() === capabilitySetUuid);
}

function getNewestCapabilitySetUuidForDevice(device: Device): [string, string] {
  const allFirmwares = device.deviceFirmwares();

  if (!allFirmwares) return ['', ''];

  let newestCapSet = null as CapabilitySet | null;
  let firmwareForNewestCapSet = null as DeviceFirmware | null;
  let capSetUpdatedAt = 0;

  allFirmwares.forEach((fw) => {
    const capSets = fw!.capabilitySets() as CapabilitySet[];
    capSets.forEach((cs) => {
      if (cs.updatedAt().getTime() > capSetUpdatedAt) {
        newestCapSet = cs;
        firmwareForNewestCapSet = fw!;
        capSetUpdatedAt = cs.updatedAt().getTime();
      }
    });
  });

  if (!newestCapSet || !firmwareForNewestCapSet) return ['', ''];

  return [firmwareForNewestCapSet.uuid(), newestCapSet.uuid()];
}

export default function DeviceFirmwareComboPicker() {
  const [deviceSettings, setDeviceSettings] = useRecoilState(DeviceSettingsAtom);
  const [displaySettings, setDisplaySettings] = useRecoilState(ComboListDisplayOptions);
  const store = useApiStore();
  const device = useContext(DevicePageContext);

  const firmwareOptions = !device
    ? []
    : (device.deviceFirmwares() as DeviceFirmware[])?.map?.((fw) => ({
        value: fw!.uuid(),
        label: fw!.name(),
      })) ?? [];

  const capSetOptions = !device
    ? []
    : getCapabilitySetsForFirmware(deviceSettings.selectedFirmwareUuid, store).map((cs) => ({
        value: cs.uuid(),
        // em dash
        label: `${cs.description()} — ${dayjs(cs.updatedAt()).format('YYYY-MM-DD')}`,
      }));

  useEffect(() => {
    if (!device) {
      setDeviceSettings({
        selectedCapabilitySetUuid: '',
        selectedFirmwareUuid: '',
        deviceUuid: '',
      });

      return;
    }

    if (deviceSettings.deviceUuid !== device.uuid()) {
      const [newestFirmware, newestCapabilitySet] = getNewestCapabilitySetUuidForDevice(device);

      setDeviceSettings({
        selectedCapabilitySetUuid: newestCapabilitySet,
        selectedFirmwareUuid: newestFirmware,
        deviceUuid: device.uuid(),
      });
    }
  }, [device, setDeviceSettings, deviceSettings, getNewestCapabilitySetUuidForDevice]);

  return (
    <Section darker usePadding width="wider">
      <div>
        <h3 className="text-loud">Combo list options</h3>
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,

            [Breakpoints.downTo.tablet]: {
              flexDirection: 'row',

              '> *': {
                flex: 1,
              },
            },
          }}
        >
          <SelectDropdown
            label="Firmware"
            options={[{ value: '', label: 'None selected' }, ...firmwareOptions]}
            value={deviceSettings.selectedFirmwareUuid}
            onChange={(value) => {
              setDeviceSettings((settings) => {
                let { selectedFirmwareUuid: selectedFirmwareUuid, selectedCapabilitySetUuid: selectedCapabilitySetUuid } = settings;

                selectedFirmwareUuid = value;

                if (selectedCapabilitySetUuid !== '') {
                  if (value === '' || !isCapabilitySetIdValidChoiceForDeviceFirmware(selectedCapabilitySetUuid!, value, store)) {
                    selectedCapabilitySetUuid = '';
                  }
                }

                return { ...settings, selectedFirmwareUuid, selectedCapabilitySetUuid };
              });
            }}
          />
          <SelectDropdown
            label="Capability set"
            disabled={deviceSettings.selectedFirmwareUuid === ''}
            options={[{ value: '', label: 'None selected' }, ...capSetOptions]}
            value={deviceSettings.selectedCapabilitySetUuid}
            onChange={(value) => {
              setDeviceSettings((deviceSettings) => ({ ...deviceSettings, selectedCapabilitySetUuid: value }));
            }}
          />
        </div>

        <h3 className="text-loud" css={{ marginTop: 24 }}>
          Display settings
        </h3>

        <div
          css={{
            display: 'grid',
            alignItems: 'center',
            gap: 16,
            gridTemplateColumns: '1fr',
            [Breakpoints.downTo.desktopSmall]: {
              gridTemplateColumns: '1fr 1fr 1fr',
            },
            [Breakpoints.between.tablet.and.desktopSmall]: {
              gridTemplateColumns: '1fr 1fr',
            },
          }}
        >
          <SelectDropdown
            label="Combo string type"
            options={[
              { value: 'simple', label: 'Simple (7_n78)' },
              { value: 'complex', label: 'Complex (7C4_n78A4)' },
              { value: 'full', label: 'Full (7C4A_n78A4A-0)' },
            ]}
            value={displaySettings.comboStringType}
            onChange={(val) => {
              setDisplaySettings((x) => ({ ...x, comboStringType: val as 'simple' | 'complex' | 'full' }));
            }}
          />

          {/* <div css={{ marginBottom: 'auto' }}>
                  <Checkbox
                    label="In expanded view, show LTE bandwidth next to class"
                    checked={displaySettings.showLteBwNextToClass}
                    onChange={(v) => {
                      setDisplaySettings((x) => ({ ...x, showLteBwNextToClass: v.target.checked }));
                    }}
                  />
                </div> */}
        </div>
      </div>
    </Section>
  );
}
