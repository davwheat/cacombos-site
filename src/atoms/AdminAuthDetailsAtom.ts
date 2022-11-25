import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'comboListDisplayOptions',
});

export interface IAdminAuthDetailsAtom {
  token: string;
}

export default atom<IAdminAuthDetailsAtom>({
  key: 'adminAuthDetailsAtom',
  default: {
    token: '',
  },
  effects_UNSTABLE: [persistAtom],
});
