import { atom } from 'recoil';

export interface IComboTableFilterState {
  comboStringQuery: string;
  ulComboStringQuery: string;
}

export default atom<IComboTableFilterState>({
  key: 'comboTableFilterState',
  default: {
    comboStringQuery: '',
    ulComboStringQuery: '',
  },
});
