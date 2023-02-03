import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'adminAuthDetails',
});

export interface IAdminAuthDetailsAtom {
  token: string;
}

export default atom<IAdminAuthDetailsAtom>({
  key: 'adminAuthDetails',
  default: {
    token: '',
  },
  effects_UNSTABLE: [persistAtom],
});
