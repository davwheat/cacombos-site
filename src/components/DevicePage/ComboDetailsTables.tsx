import ComboListDisplayOptions from '@atoms/ComboListDisplayOptions';
import { getDlComponents, getDlStreamCountForComponent, getUlComponents, getUlStreamCountForComponent } from '@functions/comboDisplayHelpers';
import friendlyQamConverter from '@functions/friendlyQamConverter';
import { TableCellCss, TableHeadCellCss } from './ComboTable';

import { useRecoilValue } from 'recoil';

import type Combo from '@api/Models/Combo';

const SHOW_COMPONENT_MODEL_ID = false;

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
  I: '160 MHz - 8CC',
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
                {SHOW_COMPONENT_MODEL_ID && <th css={TableHeadCellCss}>ID</th>}
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
                  <tr key={`${combo.id()}-lte-${cc.id()}-${cc.componentIndex()}`}>
                    {SHOW_COMPONENT_MODEL_ID && <td>{cc.id()}</td>}
                    <td>
                      <code className="code">{cc.band()}</code>
                    </td>
                    <td>
                      {cc.dlClass()} {showLteBwNextToClass && cc.dlClass() && <span className="text-whisper">({LteClassToBwCc[cc.dlClass()!]})</span>}
                    </td>
                    <td>{getDlStreamCountForComponent(cc).join('+')}</td>
                    <td>{friendlyQamConverter(cc.dlModulation())}</td>
                    <td />
                    <td />
                  </tr>
                ));

                const nrCcRows = dlNrComponents.map((cc, i) => (
                  <tr key={`${combo.id()}-nr-${cc.id()}-${cc.componentIndex()}`}>
                    {SHOW_COMPONENT_MODEL_ID && <td>{cc.id()}</td>}
                    <td>
                      <code className="code">n{cc.band()}</code>
                    </td>
                    <td>{cc.dlClass()}</td>
                    <td>{getDlStreamCountForComponent(cc).join('+')}</td>
                    <td>{friendlyQamConverter(cc.dlModulation())}</td>
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
                {SHOW_COMPONENT_MODEL_ID && <th css={TableHeadCellCss}>ID</th>}
                <th css={TableHeadCellCss}>Band</th>
                <th css={TableHeadCellCss}>Class</th>
                <th css={TableHeadCellCss}>Streams</th>
                <th css={TableHeadCellCss}>Modulation</th>
                {/* <th css={TableHeadCellCss}>NR bandwidth</th> */}
                <th css={TableHeadCellCss}>NR SCS</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const lteCcRows = ulLteComponents.map((cc, i) => (
                  <tr key={`${combo.id()}-lte-${cc.id()}-${cc.componentIndex()}`}>
                    {SHOW_COMPONENT_MODEL_ID && <td>{cc.id()}</td>}
                    <td>
                      <code className="code">{cc.band()}</code>
                    </td>
                    <td>{cc.ulClass()}</td>
                    <td>{getUlStreamCountForComponent(cc).join('+')}</td>
                    <td>{friendlyQamConverter(cc.ulModulation() ?? '16qam')}</td>
                    {/* <td /> */}
                    <td />
                  </tr>
                ));

                const nrCcRows = ulNrComponents.map((cc, i) => (
                  <tr key={`${combo.id()}-nr-${cc.id()}-${cc.componentIndex()}`}>
                    {SHOW_COMPONENT_MODEL_ID && <td>{cc.id()}</td>}
                    <td>
                      <code className="code">n{cc.band()}</code>
                    </td>
                    <td>{cc.ulClass()}</td>
                    <td>{getUlStreamCountForComponent(cc).join('+')}</td>
                    <td>{friendlyQamConverter(cc.ulModulation() ?? '64qam')}</td>
                    {/* <td>{cc.bandwidth()} MHz</td> */}
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
