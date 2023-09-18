import ComboTableRow from './ComboTableRow';
import ComboTableFilter from './ComboTableFilter';

import ComboListDisplayOptions, { IComboListDisplayOptions } from '@atoms/ComboListDisplayOptions';
import ComboTableFilterStateAtom, { IComboTableFilterState } from '@atoms/ComboTableFilterState';

import { useApiStore } from '@api/ApiStoreProvider';
import { comboListSorter } from '@functions/sortComboList';
import { getDlComboString, getUlComboString } from '@functions/comboDisplayHelpers';
import { useRecoilValue } from 'recoil';

import type Combo from '@api/Models/Combo';
import type CapabilitySet from '@api/Models/CapabilitySet';
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

function filterCombos(
  combos: Combo[],
  comboStringFormat: IComboListDisplayOptions['comboStringType'],
  filterOptions: IComboTableFilterState
): Combo[] {
  if (comboStringFormat === 'full') {
    // No UL filtering

    return combos.filter((combo) => combo.comboString().toLowerCase().includes(filterOptions.comboStringQuery.toLowerCase()));
  }

  const filteredCombos = combos.filter((combo) => {
    const comboString = getDlComboString(combo, comboStringFormat);
    const ulComboString = getUlComboString(combo, comboStringFormat);

    const dlQuery = filterOptions.comboStringQuery.toLowerCase().trim();
    const dlQueryMatch = !dlQuery ? true : comboString.toLowerCase().includes(dlQuery);

    const ulQuery = filterOptions.ulComboStringQuery.toLowerCase().trim();
    const ulQueryMatch = !ulQuery ? true : ulComboString.toLowerCase().includes(ulQuery);

    return dlQueryMatch && ulQueryMatch;
  });

  return filteredCombos;
}

export default function ComboTable({ capabilitySetUuid }: ComboTableProps) {
  const store = useApiStore();
  const { comboStringType } = useRecoilValue(ComboListDisplayOptions);
  const comboTableFilterState = useRecoilValue(ComboTableFilterStateAtom);

  const capabilitySet = store.getFirstBy<CapabilitySet>('capability-sets', 'uuid', capabilitySetUuid);

  if (!capabilitySet) return null;

  // @ts-expect-error Using protected attributes for performance
  if (!capabilitySet.data!.relationships?.combos?.data) {
    return <p className="text-speak-up">We couldn't find any combos for this device, firmware and capability set.</p>;
  }

  const allCombos = filterCombos(capabilitySet.combos() as Combo[], comboStringType, comboTableFilterState);

  allCombos.sort(comboListSorter);

  return (
    <div
      css={{
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <table
        css={{
          borderCollapse: 'collapse',
          width: '100%',

          minWidth: 'fit-content',

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
            whiteSpace: 'nowrap',
          }}
        >
          <ComboTableFilter />

          {allCombos.map((combo) => (
            <ComboTableRow key={combo.id()} combo={combo} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
