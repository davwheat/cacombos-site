import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import DeviceSettingsAtom from '@atoms/DeviceSettingsAtom';
import { useApiStore } from '../../api/ApiStoreProvider';
import useIsFirstRender from '@hooks/useIsFirstRender';
import Section from '@components/Design/Section';
import LoadingSpinner from '@components/LoadingSpinner';
import ComboTableRow from './ComboTableRow';

import type { Interpolation, Theme } from '@emotion/react';
import type CapabilitySet from '../../api/Models/CapabilitySet';
import type Combo from '../../api/Models/Combo';
import ComboListDisplayOptions from '@atoms/ComboListDisplayOptions';

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

function isFullCapSetDataLoaded(capSet: CapabilitySet | undefined): boolean {
  if (!capSet) return false;

  if (!capSet.combos()) return false;

  const combos: (Combo | undefined)[] = capSet.combos() || [];

  if (combos.some((c) => !c)) return false;

  return true;
}

export default function CapabilitySetVisualiser() {
  const [{ selectedCapabilitySetUuid }, setDeviceSettingsState] = useRecoilState(DeviceSettingsAtom);
  const { comboStringType } = useRecoilValue(ComboListDisplayOptions);
  const store = useApiStore();
  const [error, setError] = useState<null | any>(null);

  const capSet = store.getFirstBy<CapabilitySet>('capability-sets', 'uuid', selectedCapabilitySetUuid);
  const isFirstRender = useIsFirstRender();

  const [isLoadingCapSetInfo, setIsLoadingCapSetInfo] = useState(true);

  function loadFullCapSetData() {
    setIsLoadingCapSetInfo(true);

    store
      .find<CapabilitySet[]>('capability-sets', {
        include: ['combos', 'combos.lteComponents', 'combos.nrComponents'],
        filter: {
          uuid: selectedCapabilitySetUuid,
        },
        page: {
          limit: 1,
        },
      })
      .then((data) => {
        const foundCapSet = data?.[0];

        setIsLoadingCapSetInfo(false);

        if (!foundCapSet) {
          setDeviceSettingsState((state) => ({ ...state, selectedCapabilitySetUuid: 'null' }));
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  useEffect(() => {
    if (!isFullCapSetDataLoaded(capSet)) {
      loadFullCapSetData();
    } else {
      setIsLoadingCapSetInfo(false);
    }
  }, [selectedCapabilitySetUuid]);

  if (error) {
    return (
      <Section width="wider">
        <h3 className="text-loud">Combos</h3>

        <p className="text-speak">Something went wrong when fetching data for this device. Please try again later.</p>
      </Section>
    );
  }

  if (isFirstRender || selectedCapabilitySetUuid === 'null' || !selectedCapabilitySetUuid) {
    return (
      <Section width="wider">
        <h3 className="text-loud">Combos</h3>

        <p className="text-speak">Please choose a firmware and capability set from the list above.</p>
      </Section>
    );
  }

  return (
    <Section width="wider">
      <h3 className="text-loud">Combos</h3>

      {isLoadingCapSetInfo && (
        <>
          <LoadingSpinner />
          <p className="text-speak" css={{ textAlign: 'center' }}>
            Loading combos...
          </p>
        </>
      )}

      {capSet?.combos() && (
        <table
          css={{
            borderCollapse: 'collapse',
            width: '100%',

            // Fixed width for column with expand/collapse button
            '& tr > td:first-of-type': {
              width: 36,
            },
          }}
        >
          <thead css={{ fontWeight: 'bold' }}>
            <tr>
              <th css={TableHeadCellCss} />
              {comboStringType === 'full' ? <th css={TableHeadCellCss}>Combo</th> : <th css={TableHeadCellCss}>DL combo</th>}
              <th css={TableHeadCellCss}>DL MIMO (streams)</th>
              {comboStringType !== 'full' && <th css={TableHeadCellCss}>UL combo</th>}
              <th css={TableHeadCellCss}>UL MIMO (streams)</th>
            </tr>
          </thead>
          <tbody>
            {(capSet.combos() as Combo[]).map((combo) => (
              <ComboTableRow combo={combo} key={combo.uuid()} />
            ))}
          </tbody>
        </table>
      )}
    </Section>
  );
}
