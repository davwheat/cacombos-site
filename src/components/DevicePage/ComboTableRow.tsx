import React, { useState } from 'react';

import { TableCellCss } from './ComboTable';
import ComboDetailsTables from './ComboDetailsTables';
import ArrowDown from 'mdi-react/ChevronDownIcon';

import ComboListDisplayOptions from '@atoms/ComboListDisplayOptions';
import { getDlComboString, getDlComponents, getDlMimoString, getUlComboString, getUlMimoString } from '@functions/comboDisplayHelpers';
import type Combo from '@api/Models/Combo';
import generateTransitions from '@functions/generateTransitions';
import { useRecoilValue } from 'recoil';
import { css } from '@emotion/react';

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

  return (
    <>
      <tr
        data-combo-uuid={combo.uuid()}
        css={{
          '.ComboTable-cell': {
            ...TableCellCss,
            borderBottom: expandedRow ? 'none' : TableCellCss.borderBottom,
          },

          '&:hover': {
            '&, & + .ComboTable-expandedRow': {
              background: '#f5f5f5',
            },
          },
        }}
      >
        <td className="ComboTable-expanderCell ComboTable-cell" css={{ padding: '2px !important' }}>
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

        <ComboTableRowDataCells combo={combo} />
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
              {
                background: Object.values(
                  getDlComponents(combo)[1].reduce((acc, curr) => {
                    acc[curr.componentIndex()] &&= acc[curr.componentIndex()] + 1;
                    acc[curr.componentIndex()] ??= 1;

                    return acc;
                  }, {} as Record<number, number>)
                ).some((x) => x !== 1)
                  ? '#f00'
                  : '#f5f5f5',
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

interface ComboTableRowDataCellsProps {
  combo: Combo;
}

function _ComboTableRowDataCells({ combo }: ComboTableRowDataCellsProps) {
  const displayOptions = useRecoilValue(ComboListDisplayOptions);

  return (
    <>
      {displayOptions.comboStringType === 'full' ? (
        <td className="ComboTable-cell">
          <code className="code">{combo.comboString()}</code>
        </td>
      ) : (
        <td className="ComboTable-cell">
          <code className="code">{getDlComboString(combo, displayOptions.comboStringType)}</code>
        </td>
      )}

      <td className="ComboTable-cell">{getDlMimoString(combo)}</td>

      {displayOptions.comboStringType !== 'full' && (
        <td className="ComboTable-cell">
          <code className="code">{getUlComboString(combo, displayOptions.comboStringType)}</code>
        </td>
      )}

      <td className="ComboTable-cell">{getUlMimoString(combo)}</td>
    </>
  );
}

const ComboTableRowDataCells = React.memo(_ComboTableRowDataCells, (prevProps, nextProps) => {
  return prevProps.combo.id() === nextProps.combo.id();
});
