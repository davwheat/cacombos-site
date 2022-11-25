import React, { useState } from 'react';

import { useRecoilValue } from 'recoil';
import { css } from '@emotion/react';

import ComboListDisplayOptions from '@atoms/ComboListDisplayOptions';
import { getDlComboString, getDlMimoString, getUlComboString, getUlMimoString } from '@functions/comboDisplayHelpers';
import type Combo from '../../api/Models/Combo';
import { TableCellCss } from './CapabilitySetVisualiser';
import generateTransitions from '@functions/generateTransitions';

import ArrowDown from 'mdi-react/ChevronDownIcon';
import ComboDetailsTables from './ComboDetailsTables';

export interface ComboTableRowProps {
  combo: Combo;
}

const buttonUaReset = css`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  text-align: inherit;
  vertical-align: inherit;

  background: transparent;

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;

  line-height: normal;

  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  -webkit-appearance: none;
  appearance: none;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
`;

export default function ComboTableRow({ combo }: ComboTableRowProps) {
  const displayOptions = useRecoilValue(ComboListDisplayOptions);

  const COLUMN_COUNT = displayOptions.comboStringType === 'full' ? 4 : 5;

  const [expandedRow, setExpandedRow] = useState<boolean>(false);

  const tableCellCss: any[] = [TableCellCss];

  if (expandedRow) {
    tableCellCss.push({
      borderBottom: 'none',
    });
  }

  return (
    <>
      <tr
        css={{
          '&:hover': {
            '&, & + .ComboTable-expandedRow': {
              background: '#f5f5f5',
            },
          },
        }}
      >
        <td css={[...tableCellCss, { padding: 2 }]}>
          <button
            aria-label={expandedRow ? 'Collapse row' : 'Expand row'}
            css={[
              buttonUaReset,
              {
                cursor: 'pointer',
                borderRadius: '50%',
                padding: 8,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              {
                '&:hover, &:focus, &:active': {
                  background: '#e0e0e0',
                },
              },
            ]}
            onClick={() => setExpandedRow((x) => !x)}
          >
            {/* Zero-width space to provide some form of text baseline for browser to use for CSS */}
            &#8203;
            <ArrowDown
              css={[
                {
                  transform: 'rotate(-90deg)',
                  ...generateTransitions('transform', 'short'),
                },
                expandedRow && {
                  transform: 'rotate(0)',
                },
              ]}
            />
          </button>
        </td>
        {displayOptions.comboStringType === 'full' ? (
          <td css={tableCellCss}>
            <code className="code">{combo.comboString()}</code>
          </td>
        ) : (
          <td css={tableCellCss}>
            <code className="code">{getDlComboString(combo, displayOptions.comboStringType)}</code>
          </td>
        )}
        <td css={tableCellCss}>{getDlMimoString(combo)}</td>

        {displayOptions.comboStringType !== 'full' && (
          <td css={tableCellCss}>
            <code className="code">{getUlComboString(combo, displayOptions.comboStringType)}</code>
          </td>
        )}
        <td css={tableCellCss}>{getUlMimoString(combo)}</td>
      </tr>

      {expandedRow && (
        <tr className="ComboTable-expandedRow">
          <td
            colSpan={COLUMN_COUNT}
            css={[
              TableCellCss,
              {
                background: '#f5f5f5',
                padding: '16px 24px',
              },
            ]}
          >
            <ComboDetailsTables combo={combo} />
          </td>
        </tr>
      )}
    </>
  );
}
