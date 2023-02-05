import { atom } from 'recoil';

export interface IDeviceSettingsAtom {
  deviceUuid: string;
  selectedFirmwareUuid: string;
  selectedCapabilitySetUuid: string;
}

export default atom<IDeviceSettingsAtom>({
  key: 'deviceSettings',
  default: {
    deviceUuid: '',
    selectedFirmwareUuid: '',
    selectedCapabilitySetUuid: '',
  },
});
