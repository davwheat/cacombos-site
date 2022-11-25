import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'comboListDisplayOptions',
});

export interface IComboListDisplayOptions {
  comboStringType: 'simple' | 'complex' | 'full';
  showLteBwNextToClass: boolean;
}

export default atom<IComboListDisplayOptions>({
  key: 'comboListDisplayOptions',
  default: {
    comboStringType: 'simple',
    showLteBwNextToClass: true,
  },
  effects_UNSTABLE: [persistAtom],
});
