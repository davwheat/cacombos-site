import ComboListDisplayOptions from '@atoms/ComboListDisplayOptions';
import { getDlComponents, getUlComponents } from '@functions/comboDisplayHelpers';
import friendlyQamConverter from '@functions/friendlyQamConverter';
import { useRecoilValue } from 'recoil';

import type Combo from '../../api/Models/Combo';
import { TableCellCss, TableHeadCellCss } from './ComboTable';

export interface ComboDetailsTablesProps {
  combo: Combo;
}

const LteClassToBwCc: Record<string, string> = {
  A: '20 MHz',
  B: '20 MHz - 2CC',
  C: '40 MHz - 2CC',
  D: '60 MHz - 3CC',
  E: '80 MHz - 4CC',
  F: '100 MHz - 5CC',
};

export default function ComboDetailsTables({ combo }: ComboDetailsTablesProps) {
  const { showLteBwNextToClass } = useRecoilValue(ComboListDisplayOptions);

  const [dlLteComponents, dlNrComponents] = getDlComponents(combo);
  const [ulLteComponents, ulNrComponents] = getUlComponents(combo);

  dlLteComponents.sort((a, b) => b.band() - a.band());
  dlNrComponents.sort((a, b) => b.band() - a.band());

  ulLteComponents.sort((a, b) => b.band() - a.band());
  ulNrComponents.sort((a, b) => b.band() - a.band());

  return (
    <>
      <figure>
        <figcaption className="text-speak-up">Combo details (DL)</figcaption>

        <div
          css={{
            marginTop: 12,
            borderRadius: 4,
            padding: 8,
            paddingTop: 2,
          }}
        >
          <table
            css={{
              borderCollapse: 'collapse',
              width: '100%',
              background: 'white',

              '& tbody td': TableCellCss,
            }}
          >
            <thead css={{ fontWeight: 'bold' }}>
              <tr>
                <th css={TableHeadCellCss}>Band</th>
                <th css={TableHeadCellCss}>Class</th>
                <th css={TableHeadCellCss}>Streams</th>
                <th css={TableHeadCellCss}>Modulation</th>
                <th css={TableHeadCellCss}>NR bandwidth</th>
                <th css={TableHeadCellCss}>NR SCS</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const lteCcRows = dlLteComponents.map((cc, i) => (
                  <tr key={`${combo.uuid()}-lte-${i}`}>
                    <td>
                      <code className="code">{cc.band()}</code>
                    </td>
                    <td>
                      {cc.dlClass()} {showLteBwNextToClass && cc.dlClass() && <span className="text-whisper">({LteClassToBwCc[cc.dlClass()!]})</span>}
                    </td>
                    <td>{cc.mimo()}</td>
                    <td>{friendlyQamConverter(cc.dlModulation() ?? '64qam')}</td>
                    <td />
                    <td />
                  </tr>
                ));

                const nrCcRows = dlNrComponents.map((cc, i) => (
                  <tr key={`${combo.uuid()}-nr-${i}`}>
                    <td>
                      <code className="code">n{cc.band()}</code>
                    </td>
                    <td>{cc.dlClass()}</td>
                    <td>{cc.dlMimo()}</td>
                    <td>{friendlyQamConverter(cc.dlModulation() ?? '256qam')}</td>
                    <td>{cc.bandwidth()} MHz</td>
                    <td>{cc.subcarrierSpacing()} kHz</td>
                  </tr>
                ));

                return [...lteCcRows, ...nrCcRows];
              })()}
            </tbody>
          </table>
        </div>
      </figure>

      <figure css={{ marginTop: 16 }}>
        <figcaption className="text-speak-up">Combo details (UL)</figcaption>

        <div
          css={{
            marginTop: 12,
            borderRadius: 4,
            padding: 8,
            paddingTop: 2,
          }}
        >
          <table
            css={{
              borderCollapse: 'collapse',
              width: '100%',
              background: 'white',

              '& tbody td': TableCellCss,
            }}
          >
            <thead css={{ fontWeight: 'bold' }}>
              <tr>
                <th css={TableHeadCellCss}>Band</th>
                <th css={TableHeadCellCss}>Class</th>
                <th css={TableHeadCellCss}>Streams</th>
                <th css={TableHeadCellCss}>Modulation</th>
                <th css={TableHeadCellCss}>NR bandwidth</th>
                <th css={TableHeadCellCss}>NR SCS</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const lteCcRows = ulLteComponents.map((cc, i) => (
                  <tr key={`${combo.uuid()}-lte-${i}`}>
                    <td>
                      <code className="code">{cc.band()}</code>
                    </td>
                    <td>{cc.ulClass()}</td>
                    <td>{/* {cc.mimo()} */}1</td>
                    <td>{friendlyQamConverter(cc.ulModulation() ?? '16qam')}</td>
                    <td />
                    <td />
                  </tr>
                ));

                const nrCcRows = ulNrComponents.map((cc, i) => (
                  <tr key={`${combo.uuid()}-nr-${i}`}>
                    <td>
                      <code className="code">n{cc.band()}</code>
                    </td>
                    <td>{cc.ulClass()}</td>
                    <td>{cc.ulMimo()}</td>
                    <td>{friendlyQamConverter(cc.ulModulation() ?? '64qam')}</td>
                    <td>{cc.bandwidth()} MHz</td>
                    <td>{cc.subcarrierSpacing()} kHz</td>
                  </tr>
                ));

                return [...lteCcRows, ...nrCcRows];
              })()}
            </tbody>
          </table>
        </div>
      </figure>
    </>
  );
}
