import ComboListDisplayOptions from '@atoms/ComboListDisplayOptions';
import ComboTableFilterState from '@atoms/ComboTableFilterState';
import TextBox from '@components/Inputs/TextBox';
import { useRecoilState, useRecoilValue } from 'recoil';
import { TableCellCss } from './ComboTable';

export default function ComboTableFilter() {
  const displayOptions = useRecoilValue(ComboListDisplayOptions);
  const COLUMN_COUNT = displayOptions.comboStringType === 'full' ? 4 : 5;

  const [comboTableFilterState, setComboTableFilterState] = useRecoilState(ComboTableFilterState);

  return (
    <tr
      css={{
        '.ComboTable-cell': {
          ...TableCellCss,
        },
      }}
    >
      <td className="ComboTable-cell" />
      <td className="ComboTable-cell">
        <TextBox
          label={`Filter by DL ${displayOptions.comboStringType === 'simple' ? 'CCs' : 'combo'}`}
          placeholder="E.g., 1_n78"
          value={comboTableFilterState.comboStringQuery}
          onInput={(val) => {
            setComboTableFilterState((old) => ({ ...old, comboStringQuery: val }));
          }}
        />
      </td>
      <td className="ComboTable-cell" />
      {COLUMN_COUNT === 4 ? (
        <>
          <td className="ComboTable-cell" />
          <td className="ComboTable-cell" />
        </>
      ) : (
        <>
          <td className="ComboTable-cell">
            <TextBox
              label="Filter by UL CCs"
              placeholder="E.g., 1_n78"
              value={comboTableFilterState.ulComboStringQuery}
              onInput={(val) => {
                setComboTableFilterState((old) => ({ ...old, ulComboStringQuery: val }));
              }}
            />
          </td>
          <td className="ComboTable-cell" />
        </>
      )}
    </tr>
  );
}
