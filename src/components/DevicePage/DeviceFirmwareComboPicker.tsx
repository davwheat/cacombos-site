import { useRecoilState } from 'recoil';
import DeviceSettingsAtom from '@atoms/DeviceSettingsAtom';
import ComboListDisplayOptions from '@atoms/ComboListDisplayOptions';
import SelectDropdown from '@components/Inputs/SelectDropdown';
import { DevicePageContext } from './DevicePage';
import Section from '@components/Design/Section';
import { useApiStore } from '../../api/ApiStoreProvider';
import dayjs from 'dayjs';
import Breakpoints from '@data/breakpoints';

import type DeviceFirmware from '../../api/Models/DeviceFirmware';
import type CapabilitySet from '../../api/Models/CapabilitySet';

export interface DeviceFirmwareComboPickerProps {}

export default function DeviceFirmwareComboPicker(props: DeviceFirmwareComboPickerProps) {
  const [deviceSettings, setDeviceSettings] = useRecoilState(DeviceSettingsAtom);
  const [displaySettings, setDisplaySettings] = useRecoilState(ComboListDisplayOptions);
  const store = useApiStore();

  function getCapabilitySetsForFirmware(deviceFirmwareUuid: string): CapabilitySet[] {
    if (deviceFirmwareUuid === '' || !deviceFirmwareUuid) return [];

    const fw = store.getFirstBy<DeviceFirmware>('device-firmwares', 'uuid', deviceFirmwareUuid)!;
    const capSets = fw.capabilitySets() as CapabilitySet[];

    return capSets;
  }

  function isCapabilitySetIdValidChoiceForDeviceFirmware(capabilitySetUuid: string, deviceFirmwareUuid: string) {
    return getCapabilitySetsForFirmware(deviceFirmwareUuid).some((cs) => cs!.uuid() === capabilitySetUuid);
  }

  return (
    <Section darker usePadding width="wider">
      <DevicePageContext.Consumer>
        {(device) => {
          if (!device) return null;

          const firmwareOptions =
            (device.deviceFirmwares() as DeviceFirmware[])?.map?.((fw) => ({
              value: fw!.uuid(),
              label: fw!.name(),
            })) ?? [];

          const capSetOptions = getCapabilitySetsForFirmware(deviceSettings.selectedFirmwareUuid).map((cs) => ({
            value: cs.uuid(),
            // em dash
            label: `${cs.description()} — ${dayjs(cs.updatedAt()).format('YYYY-MM-DD')}`,
          }));

          return (
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
                        if (value === '') {
                          selectedCapabilitySetUuid = '';
                        } else if (!isCapabilitySetIdValidChoiceForDeviceFirmware(selectedCapabilitySetUuid!, value)) {
                          selectedCapabilitySetUuid = 'null';
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
                    setDeviceSettings({ ...deviceSettings, selectedCapabilitySetUuid: value });
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
          );
        }}
      </DevicePageContext.Consumer>
    </Section>
  );
}
