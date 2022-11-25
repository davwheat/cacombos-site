import { atom } from 'recoil';

export interface IDeviceSettingsAtom {
  selectedFirmwareUuid: string;
  selectedCapabilitySetUuid: string;
}

export default atom<IDeviceSettingsAtom>({
  key: 'deviceSettings',
  default: {
    selectedFirmwareUuid: '',
    selectedCapabilitySetUuid: '',
  },
});
