import ComboTableRow from './ComboTableRow';

import ComboListDisplayOptions from '@atoms/ComboListDisplayOptions';

import { useApiStore } from '../../api/ApiStoreProvider';
import { comboListSorter } from '@functions/sortComboList';
import { useRecoilValue } from 'recoil';

import type Combo from '../../api/Models/Combo';
import type CapabilitySet from '../../api/Models/CapabilitySet';
import type { Interpolation, Theme } from '@emotion/react';

export interface ComboTableProps {
  capabilitySetUuid: string;
}

export const TableCellCss = {
  borderBottom: '1px solid #ddd',
  padding: '8px 16px',
};

export const TableHeadCellCss: Interpolation<Theme> = [
  TableCellCss,
  {
    borderBottom: '2px solid black',
    textAlign: 'left',
  },
];

export default function ComboTable({ capabilitySetUuid }: ComboTableProps) {
  const store = useApiStore();
  const { comboStringType } = useRecoilValue(ComboListDisplayOptions);

  const capabilitySet = store.getFirstBy<CapabilitySet>('capability-sets', 'uuid', capabilitySetUuid);

  if (!capabilitySet) return null;

  // @ts-expect-error Using protected attributes for performance
  if (!capabilitySet.data!.relationships?.combos?.data)
    return <p className="text-speak-up">We couldn't find any combos for this device, firmware and capability set.</p>;

  // const allCombos = useMemo(() => {
  //   const combos = capabilitySet.combos() as Combo[];

  //   combos.sort(comboListSorter);

  //   return combos;
  // }, [capabilitySet.uuid(), capabilitySet.data!.relationships?.combos?.data?.length]);

  const allCombos = capabilitySet.combos() as Combo[];

  allCombos.sort(comboListSorter);

  return (
    <table
      css={{
        borderCollapse: 'collapse',
        width: '100%',

        // Fixed width for column with expand/collapse button
        '& > thead, > tbody': {
          '.ComboTable-expanderCell': {
            width: 36,
          },
        },
      }}
    >
      <thead css={{ fontWeight: 'bold' }}>
        <tr>
          <th className="ComboTable-expanderCell" css={TableHeadCellCss} />
          {comboStringType === 'full' ? <th css={TableHeadCellCss}>Combo</th> : <th css={TableHeadCellCss}>DL combo</th>}
          <th css={TableHeadCellCss}>DL MIMO (streams)</th>
          {comboStringType !== 'full' && <th css={TableHeadCellCss}>UL combo</th>}
          <th css={TableHeadCellCss}>UL MIMO (streams)</th>
        </tr>
      </thead>
      <tbody
        css={{
          wordBreak: 'break-all',
        }}
      >
        {allCombos.map((combo) => (
          <ComboTableRow key={combo.uuid()} combo={combo} />
        ))}
      </tbody>
    </table>
  );
}
